// src/index.ts - Main Express Server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import categoryRoutes from './routes/categories';
import budgetRoutes from './routes/budgets';
import analyticsRoutes from './routes/analytics';
import { errorHandler } from './middleware/errorHandler';
import { limiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`BudgetBot API running on port ${PORT}`);
});

// src/middleware/auth.ts - JWT Authentication
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// src/routes/transactions.ts - Transaction Routes
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { pool } from '../db';
import axios from 'axios';

const router = Router();

router.post('/', authenticate, async (req: any, res) => {
  const { amount, type, description, transaction_date, category_id } = req.body;
  const userId = req.userId;

  try {
    // Auto-categorize if no category provided
    let finalCategoryId = category_id;
    if (!category_id && description) {
      const mlResponse = await axios.post(`${process.env.ML_API_URL}/categorize`, {
        description,
        amount,
        type
      });
      finalCategoryId = mlResponse.data.category_id;
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, description, transaction_date, category_id, source)
       VALUES ($1, $2, $3, $4, $5, $6, 'manual') RETURNING *`,
      [userId, amount, type, description, transaction_date, finalCategoryId]
    );

    // Check for budget alerts
    await checkBudgetAlerts(userId, finalCategoryId, amount);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.get('/', authenticate, async (req: any, res) => {
  const userId = req.userId;
  const { start_date, end_date, category_id, type } = req.query;

  try {
    let query = `
      SELECT t.*, c.name as category_name, c.color, c.icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
    const params: any[] = [userId];
    let paramCount = 1;

    if (start_date) {
      paramCount++;
      query += ` AND t.transaction_date >= $${paramCount}`;
      params.push(start_date);
    }
    if (end_date) {
      paramCount++;
      query += ` AND t.transaction_date <= $${paramCount}`;
      params.push(end_date);
    }
    if (category_id) {
      paramCount++;
      query += ` AND t.category_id = $${paramCount}`;
      params.push(category_id);
    }
    if (type) {
      paramCount++;
      query += ` AND t.type = $${paramCount}`;
      params.push(type);
    }

    query += ` ORDER BY t.transaction_date DESC LIMIT 100`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.delete('/:id', authenticate, async (req: any, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

async function checkBudgetAlerts(userId: number, categoryId: number, amount: number) {
  const budgetResult = await pool.query(
    `SELECT * FROM budget_goals 
     WHERE user_id = $1 AND category_id = $2 AND is_active = true`,
    [userId, categoryId]
  );

  if (budgetResult.rows.length > 0) {
    const budget = budgetResult.rows[0];
    const spentResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_spent
       FROM transactions
       WHERE user_id = $1 AND category_id = $2
       AND transaction_date >= date_trunc('month', CURRENT_DATE)`,
      [userId, categoryId]
    );

    const totalSpent = parseFloat(spentResult.rows[0].total_spent);
    const budgetAmount = parseFloat(budget.amount);

    if (totalSpent >= budgetAmount * 0.8) {
      await pool.query(
        `INSERT INTO alerts (user_id, type, message, severity)
         VALUES ($1, 'overspending', $2, $3)`,
        [
          userId,
          `You've spent ${((totalSpent / budgetAmount) * 100).toFixed(0)}% of your budget`,
          totalSpent >= budgetAmount ? 'critical' : 'warning'
        ]
      );
    }
  }
}

export default router;

// src/routes/analytics.ts - Analytics & Predictions
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { pool } from '../db';
import axios from 'axios';

const router = Router();

router.get('/summary', authenticate, async (req: any, res) => {
  const userId = req.userId;
  const { period = 'month' } = req.query;

  try {
    const dateFilter = period === 'month' 
      ? `date_trunc('month', CURRENT_DATE)`
      : `date_trunc('week', CURRENT_DATE)`;

    const result = await pool.query(
      `SELECT 
        type,
        COALESCE(SUM(amount), 0) as total,
        COUNT(*) as count
       FROM transactions
       WHERE user_id = $1 
       AND transaction_date >= ${dateFilter}
       GROUP BY type`,
      [userId]
    );

    const summary = {
      income: 0,
      expenses: 0,
      net: 0,
      transactionCount: 0
    };

    result.rows.forEach(row => {
      if (row.type === 'income') summary.income = parseFloat(row.total);
      if (row.type === 'expense') summary.expenses = parseFloat(row.total);
      summary.transactionCount += parseInt(row.count);
    });

    summary.net = summary.income - summary.expenses;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.get('/forecast', authenticate, async (req: any, res) => {
  const userId = req.userId;

  try {
    const transactions = await pool.query(
      `SELECT amount, transaction_date, category_id
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       ORDER BY transaction_date DESC
       LIMIT 365`,
      [userId]
    );

    const mlResponse = await axios.post(`${process.env.ML_API_URL}/forecast`, {
      user_id: userId,
      transactions: transactions.rows
    });

    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

router.get('/recommendations', authenticate, async (req: any, res) => {
  const userId = req.userId;

  try {
    const mlResponse = await axios.post(`${process.env.ML_API_URL}/recommend`, {
      user_id: userId
    });

    res.json(mlResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;
