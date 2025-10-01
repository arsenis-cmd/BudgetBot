import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, PiggyBank } from 'lucide-react';

const BudgetBotDashboard = () => {
  const [summary, setSummary] = useState({
    income: 5420,
    expenses: 3890,
    net: 1530,
    transactionCount: 47
  });

  const [categoryData, setCategoryData] = useState([
    { name: 'Groceries', value: 680, color: '#EF4444' },
    { name: 'Dining', value: 420, color: '#F97316' },
    { name: 'Transportation', value: 320, color: '#3B82F6' },
    { name: 'Entertainment', value: 280, color: '#8B5CF6' },
    { name: 'Utilities', value: 450, color: '#F59E0B' },
    { name: 'Shopping', value: 740, color: '#14B8A6' },
    { name: 'Other', value: 1000, color: '#6B7280' }
  ]);

  const [trendData, setTrendData] = useState([
    { month: 'Jul', income: 5200, expenses: 3600 },
    { month: 'Aug', income: 5400, expenses: 3800 },
    { month: 'Sep', income: 5100, expenses: 4100 },
    { month: 'Oct', income: 5420, expenses: 3890 }
  ]);

  const [alerts, setAlerts] = useState([
    { type: 'warning', message: "You're at 85% of your dining budget", category: 'Dining' },
    { type: 'info', message: 'Grocery spending 15% higher than usual', category: 'Groceries' },
    { type: 'success', message: 'You saved $200 more than last month!', category: 'Savings' }
  ]);

  const [recommendations, setRecommendations] = useState([
    { message: 'Move $200 to savings based on current income', savings: 200 },
    { message: 'Reduce dining by $120/month with meal prep', savings: 120 },
    { message: 'Switch to annual subscriptions to save $45', savings: 45 }
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const AlertIcon = ({ type }) => {
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    if (type === 'success') return <TrendingUp className="w-5 h-5 text-green-500" />;
    return <TrendingDown className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">BudgetBot Dashboard</h1>
          <p className="text-slate-600">AI-powered financial insights for October 2025</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Income</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(summary.income)}</div>
            <div className="text-sm text-green-600 mt-1">+8% from last month</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Expenses</span>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(summary.expenses)}</div>
            <div className="text-sm text-red-600 mt-1">-5% from last month</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Net Savings</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(summary.net)}</div>
            <div className="text-sm text-blue-600 mt-1">{((summary.net / summary.income) * 100).toFixed(1)}% savings rate</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Transactions</span>
              <PiggyBank className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{summary.transactionCount}</div>
            <div className="text-sm text-purple-600 mt-1">This month</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending by Category Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expenses Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Income vs Expenses Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border-l-4 border-orange-500">
                  <AlertIcon type={alert.type} />
                  <div className="flex-1">
                    <p className="text-slate-700 font-medium">{alert.message}</p>
                    <p className="text-sm text-slate-500 mt-1">{alert.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">AI Recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <p className="text-slate-700 font-medium">{rec.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-600">Potential Impact</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(rec.savings)}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-green-800 font-bold text-center">
                  Total Potential Monthly Savings: {formatCurrency(recommendations.reduce((sum, r) => sum + r.savings, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to optimize your finances?</h3>
          <p className="mb-4 opacity-90">Let AI analyze your spending patterns and create a personalized budget plan</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetBotDashboard;
