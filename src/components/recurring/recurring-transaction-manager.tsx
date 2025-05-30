import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.types';
import {
  fetchRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  fetchRecurringTransactionsDueToday,
} from '../../slices/daily-expenses-slice';
import { CreateRecurringTransaction, UpdateRecurringTransaction, RecurringTransaction } from '../../types';
import { Repeat, Plus, Edit, Trash2, Clock, AlertCircle, Calendar, Play, Pause } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../action/button';
import { KeyboardShortcutsHelp } from '../ui/keyboard-shortcuts-help';

export const RecurringTransactionManager: React.FC = () => {
  const dispatch = useDispatch();
  const recurringTransactions = useSelector((state: RootState) => state.dailyExpenses.recurringTransactions);
  const recurringDueToday = useSelector((state: RootState) => state.dailyExpenses.recurringDueToday);
  const categories = useSelector((state: RootState) => state.dailyExpenses.categories);
  const accounts = useSelector((state: RootState) => state.dailyExpenses.accounts);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [formData, setFormData] = useState<CreateRecurringTransaction>({
    name: '',
    amount: 0,
    category_id: undefined,
    account_id: undefined,
    frequency: 'monthly',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: undefined,
    note: '',
  });

  useEffect(() => {
    dispatch(fetchRecurringTransactions());
    dispatch(fetchRecurringTransactionsDueToday());
  }, [dispatch]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTransaction) {
      const updateData: UpdateRecurringTransaction = {
        name: formData.name,
        amount: formData.amount,
        category_id: formData.category_id,
        account_id: formData.account_id,
        frequency: formData.frequency,
        end_date: formData.end_date,
        note: formData.note,
      };
      await dispatch(
        updateRecurringTransaction({
          id: editingTransaction.id,
          data: updateData,
        })
      );
    } else {
      await dispatch(createRecurringTransaction(formData));
    }

    setShowForm(false);
    setEditingTransaction(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: 0,
      category_id: undefined,
      account_id: undefined,
      frequency: 'monthly',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: undefined,
      note: '',
    });
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      category_id: transaction.category?.id,
      account_id: transaction.account?.id,
      frequency: transaction.frequency,
      start_date: transaction.start_date,
      end_date: transaction.end_date,
      note: transaction.note || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      await dispatch(deleteRecurringTransaction(id));
    }
  };
  const handleToggleActive = async (transaction: RecurringTransaction) => {
    await dispatch(
      updateRecurringTransaction({
        id: transaction.id,
        data: { is_active: !transaction.is_active },
      })
    );
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      case 'monthly':
        return '🗓️';
      case 'yearly':
        return '🎂';
      default:
        return '🔄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Due Today Section */}
      {recurringDueToday.length > 0 && (
        <div className="glass-card rounded-xl p-6 border-orange-500/50">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Due Today</h3>
          </div>
          <div className="space-y-3">
            {recurringDueToday.map((item) => (
              <div key={item.id} className="glass-card rounded-lg p-3 border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.category?.emoji || '💰'}</span>
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">
                        ${item.amount.toFixed(2)} • {item.frequency}
                        {item.days_overdue > 0 && (
                          <span className="text-red-400 ml-2">({item.days_overdue} days overdue)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Main Recurring Transactions */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Repeat className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Recurring Transactions</h2>
          </div>
          <div className="flex items-center space-x-2">
            <KeyboardShortcutsHelp />
            <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="h-4 w-4 mr-2" />}>
              <span className="hidden sm:inline">Add Recurring</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {recurringTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Repeat className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 mb-2">No recurring transactions set up</p>
              <p className="text-sm text-slate-500">Add recurring subscriptions, bills, or regular income</p>
            </div>
          ) : (
            recurringTransactions.map((transaction) => (
              <div key={transaction.id} className="glass-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getFrequencyIcon(transaction.frequency)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">{transaction.name}</h4>
                        {!transaction.is_active && (
                          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Paused</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">
                        {transaction.category?.emoji} {transaction.category?.value} •{transaction.account?.value}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">${transaction.amount.toFixed(2)}</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleToggleActive(transaction)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title={transaction.is_active ? 'Pause' : 'Resume'}
                      >
                        {transaction.is_active ? (
                          <Pause className="h-4 w-4 text-orange-400" />
                        ) : (
                          <Play className="h-4 w-4 text-green-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <Edit className="h-4 w-4 text-slate-400 hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Every {transaction.frequency}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Next: {format(parseISO(transaction.next_execution), 'MMM dd')}</span>
                  </div>
                </div>

                {transaction.note && <p className="text-xs text-slate-500 mt-2">{transaction.note}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingTransaction ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Netflix Subscription"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.emoji} {category.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Account</label>
                  <select
                    value={formData.account_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        account_id: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Select account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                      })
                    }
                    className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full glass-input rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      end_date: e.target.value || undefined,
                    })
                  }
                  className="w-full glass-input rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Note (Optional)</label>
                <textarea
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-white h-20"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                    resetForm();
                  }}
                  className="flex-1 glass-button px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 glass-button px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                >
                  {editingTransaction ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
