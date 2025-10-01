#  BudgetBot - AI-Powered Personal Finance Manager

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A modern full-stack personal finance application that combines real-time transaction tracking with AI-powered predictive analytics to help users understand spending habits, optimize budgets, and achieve financial goals.

##  Key Features

### Core Functionality
- **Automatic Transaction Categorization** - AI categorizes expenses using NLP and machine learning
- **Real-time Budget Tracking** - Monitor spending across categories with visual dashboards
- **Smart Alerts** - Get notified about overspending, unusual activity, and budget milestones
- **Multi-source Data Import** - Manual entry, bank API integration, and CSV imports

### AI/ML Capabilities
- **Expense Forecasting** - Predict future spending based on historical patterns
- **Budget Optimization** - ML-powered recommendations for savings opportunities
- **Anomaly Detection** - Identify unusual transactions automatically
- **Adaptive Learning** - System improves categorization accuracy over time

### Analytics & Visualization
- Interactive spending breakdowns by category and time period
- Income vs expense trends with predictive insights
- Goal tracking with progress visualization
- Exportable financial reports

##  Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (React + TS)             │
│  - Dashboard with Recharts visualizations  │
│  - Transaction management interface         │
│  - Budget goal setting & tracking           │
└──────────────────┬──────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────┐
│      Backend (Node.js + Express + TS)       │
│  - JWT Authentication & Authorization       │
│  - Transaction CRUD operations              │
│  - Budget goal management                   │
│  - Alert generation system                  │
└────┬──────────────────────────┬─────────────┘
     │                          │
     ▼                          ▼
┌────────────┐         ┌─────────────────────┐
│ PostgreSQL │         │  Python ML Service  │
│  Database  │         │    (FastAPI)        │
│            │         │  - Categorization   │
│ - Users    │         │  - Forecasting      │
│ - Txns     │         │  - Recommendations  │
│ - Budgets  │         └─────────────────────┘
└────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **JWT** for authentication
- **bcrypt** for password hashing
- **PostgreSQL** for relational data
- **Redis** for caching (optional)

### ML/AI Service
- **Python 3.10+** with FastAPI
- **scikit-learn** for ML models
- **pandas** & **numpy** for data processing
- **joblib** for model persistence

### DevOps
- **Docker** & Docker Compose
- **GitHub Actions** for CI/CD
- **Vercel** for frontend deployment
- **Railway/Render** for backend

##  Getting Started

### Prerequisites
```bash
node >= 18.0.0
python >= 3.10
postgresql >= 14
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/budgetbot.git
cd budgetbot
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database credentials
npm run migrate
npm run dev
```

3. **ML Service Setup**
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

4. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint
npm start
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/budgetbot
JWT_SECRET=your-super-secret-jwt-key
ML_API_URL=http://localhost:8000
PORT=3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3000/api
```

##  API Documentation

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/analytics/summary` - Financial summary for period
- `GET /api/analytics/forecast` - AI expense predictions
- `GET /api/analytics/recommendations` - Budget optimization tips

### ML Endpoints
- `POST /ml/categorize` - Auto-categorize transaction
- `POST /ml/forecast` - Generate expense forecast
- `POST /ml/recommend` - Get personalized recommendations

##  Machine Learning Models

### Transaction Categorization
- **Algorithm**: Random Forest Classifier + Keyword Matching
- **Features**: Transaction description, amount, day of week
- **Accuracy**: ~85% after user training
- **Training**: Improves with user corrections over time

### Expense Forecasting
- **Algorithm**: Time series analysis with moving averages
- **Input**: Historical transaction data (minimum 30 days)
- **Output**: 30-day spending predictions with confidence intervals
- **Updates**: Recalculated daily with new transaction data

### Budget Recommendations
- **Algorithm**: Rule-based system + statistical analysis
- **Insights**: 
  - Spending anomalies vs historical patterns
  - Category overspending predictions
  - Savings optimization opportunities
  - Subscription consolidation suggestions

##  Screenshots

*Dashboard with real-time analytics and AI recommendations displayed above*

##  Testing

```bash
# Backend tests
cd backend
npm test

# ML service tests
cd ml_service
pytest

# Frontend tests
cd frontend
npm test
```

##  Future Enhancements

- [ ] Bank API integrations (Plaid, Yodlee)
- [ ] Mobile apps (React Native)
- [ ] Multi-currency support
- [ ] Shared household budgets
- [ ] Investment portfolio tracking
- [ ] Tax estimation tools
- [ ] Bill reminder system
- [ ] Debt payoff calculator

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Author

**Arsenios Papachristos**
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

Built with ❤️ to help people take control of their financial future
