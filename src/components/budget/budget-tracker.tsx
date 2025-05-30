import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.types';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../../slices/daily-expenses-slice';
import { CreateBudget, UpdateBudget, Budget } from '../../types';
import { PiggyBank, Plus, Edit, Trash2, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { CurrencyDisplay } from '../currency';
import { Modal } from '../ui/modal';
import { Button } from '../action/button';
import { KeyboardShortcutsHelp } from '../ui/keyboard-shortcuts-help';

export const BudgetTracker: React.FC = () => {
  const dispatch = useDispatch();
  const budgets = useSelector((state: RootState) => state.dailyExpenses.budgets);
  const categories = useSelector((state: RootState) => state.dailyExpenses.categories);
  const [year, month] = useSelector((state: RootState) => state.dailyExpenses.yearmonth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category_id: 0,
    budgeted_amount: 0,
  });

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch, year, month]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBudget) {
      const updateData: UpdateBudget = {
        budgeted_amount: formData.budgeted_amount,
      };
      await dispatch(updateBudget({ id: editingBudget.id, data: updateData }));
    } else {
      const newBudget: CreateBudget = {
        category_id: formData.category_id,
        month: month + 1, // API expects 1-indexed month
        year,
        budgeted_amount: formData.budgeted_amount,
      };
      await dispatch(createBudget(newBudget));
    }

    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ category_id: 0, budgeted_amount: 0 });
  };
  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category.id,
      budgeted_amount: budget.budgeted_amount,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (budgetId: number) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await dispatch(deleteBudget(budgetId));
    }
  };

  const getBudgetProgressColor = (percentage: number, isOverBudget: boolean) => {
    if (isOverBudget) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted_amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent_amount, 0);
  const totalRemaining = budgets.reduce((sum, budget) => sum + budget.remaining_amount, 0);

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="rounded-2xl h-full animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Budget Overview</h2>
          </div>
          <div className="flex items-center space-x-2">
            <KeyboardShortcutsHelp />
            <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-4 w-4 mr-2" />}>
              <span className="hidden sm:inline">Add Budget</span>
            </Button>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-400">Total Budgeted</span>
            </div>
            <p className="text-2xl font-bold text-white">
              <CurrencyDisplay amount={totalBudgeted} />
            </p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-slate-400">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-white">
              <CurrencyDisplay amount={totalSpent} />
            </p>
          </div>
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <PiggyBank className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-400">Remaining</span>
            </div>
            <p className="text-2xl font-bold text-white">
              <CurrencyDisplay amount={totalRemaining} />
            </p>
          </div>
        </div>

        {/* Budget List */}
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <PiggyBank className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 mb-2">No budgets set for this month</p>
              <p className="text-sm text-slate-500">Create your first budget to start tracking your spending</p>
            </div>
          ) : (
            budgets.map((budget) => (
              <div key={budget.id} className="glass-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{budget.category.emoji || '📊'}</span>
                    <span className="font-medium text-white">{budget.category.value}</span>
                    {budget.is_over_budget && <AlertTriangle className="h-4 w-4 text-red-400" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-slate-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      ${budget.spent_amount.toFixed(2)} of ${budget.budgeted_amount.toFixed(2)}
                    </span>
                    <span className={`font-medium ${budget.is_over_budget ? 'text-red-400' : 'text-green-400'}`}>
                      {budget.percentage_used.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getBudgetProgressColor(
                        budget.percentage_used,
                        budget.is_over_budget
                      )}`}
                      style={{
                        width: `${Math.min(budget.percentage_used, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      {budget.is_over_budget ? 'Over by' : 'Remaining'}:
                      <span className={`ml-1 ${budget.is_over_budget ? 'text-red-400' : 'text-green-400'}`}>
                        ${Math.abs(budget.remaining_amount).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Budget Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Add New Budget'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingBudget && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: parseInt(e.target.value),
                  })
                }
                className="w-full glass-input rounded-lg px-3 py-2 text-white"
                required
              >
                <option value={0}>Select a category</option>
                {categories
                  .filter((cat) => cat.section === 'EXPENSE')
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.emoji} {category.value}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Budget Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.budgeted_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budgeted_amount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full glass-input rounded-lg px-3 py-2 text-white"
              placeholder="Enter budget amount"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBudget(null);
                setFormData({ category_id: 0, budgeted_amount: 0 });
              }}
              className="flex-1 glass-button px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 glass-button px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
            >
              {editingBudget ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
