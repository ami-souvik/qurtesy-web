import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store.types';
import { formatCurrency } from '../components/currency';
import { BarChart3, TrendingUp, PiggyBank, Repeat, ArrowRight, Calendar, DollarSign } from 'lucide-react';

const LandingPage: React.FC = () => {
  const summary = useSelector((state: RootState) => state.dailyExpenses.summary);
  const budgets = useSelector((state: RootState) => state.dailyExpenses.budgets);
  const recurringDueToday = useSelector((state: RootState) => state.dailyExpenses.recurringDueToday);

  const quickStats = [
    {
      label: 'Current Balance',
      value: formatCurrency(summary.balance),
      icon: DollarSign,
      color: summary.balance >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: summary.balance >= 0 ? 'bg-green-400/10' : 'bg-red-400/10',
    },
    {
      label: 'Monthly Income',
      value: formatCurrency(summary.income),
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Monthly Expenses',
      value: formatCurrency(summary.expense),
      icon: TrendingUp,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
    {
      label: 'Active Budgets',
      value: budgets.length.toString(),
      icon: PiggyBank,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
  ];
  const quickActions = [
    {
      title: 'View Dashboard',
      description: 'Access your complete financial overview',
      icon: BarChart3,
      path: '/dashboard',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Manage Budgets',
      description: 'Set and track your spending limits',
      icon: PiggyBank,
      path: '/dashboard',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Recurring Transactions',
      description: 'Handle subscriptions and regular payments',
      icon: Repeat,
      path: '/dashboard',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  return (
    <main className="container mx-auto">
      <div className="py-16 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Qurtesy Finance</h1>
          <p className="text-xl text-slate-400 mb-8">
            Take control of your financial journey with intelligent tracking and insights
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {recurringDueToday.length > 0 && (
          <div className="glass-card rounded-xl p-6 border-orange-500/50">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Attention Needed</h3>
            </div>
            <p className="text-slate-400 mb-4">
              {recurringDueToday.length} recurring transaction{recurringDueToday.length > 1 ? 's' : ''} need
              {recurringDueToday.length === 1 ? 's' : ''} your attention today.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>Review Transactions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="glass-card rounded-xl p-6 hover:bg-white/5 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-4`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-slate-400 mb-4">{action.description}</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
