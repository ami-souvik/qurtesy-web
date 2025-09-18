import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/index.types';
import { fetchRecurringTransactionsDueToday } from '../../slices/transactions-slice';
import {
  CreateRecurringTransaction,
  RecurringTransaction,
  Category,
  Account,
  TransactionType,
  Frequency,
} from '../../types';
import { Repeat, Edit, Trash2, Clock, AlertCircle, Play, Pause, CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { sqlite } from '../../config';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { CategoryPicker } from '../form/category-picker';
import { Button } from '../action/button';
import { AccountPicker } from '../form/account-picker';
import { Calendar } from '../form/calendar';

export const RecurringTransactionManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recurringTransactions = sqlite.transactions.get<RecurringTransaction>('recurring_rule != NULL');
  const recurringDueToday = useSelector((state: RootState) => state.transactions.recurringDueToday);
  const categories = sqlite.categories.get<Category>();
  const accounts = sqlite.categories.get<Account>();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const handleAdd = () => {
    setShowForm(true);
  };
  const initialData = {
    type: TransactionType.expense,
    name: '',
    amount: 0,
    category: categories[0],
    account: accounts[0],
    frequency: Frequency.monthly,
    start_date: new Date(),
    end_date: undefined,
    is_active: true,
    note: undefined,
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateRecurringTransaction & { category: Category }>({
    mode: 'onChange',
    defaultValues: initialData,
  });

  useEffect(() => {
    dispatch(fetchRecurringTransactionsDueToday());
  }, [dispatch]);

  const onSubmit = async (data: CreateRecurringTransaction) => {
    try {
      sqlite.transactions.create(data);
      reset(initialData);
    } catch (err: unknown) {
      console.log('Failed to create recurring transaction. Error: ', err);
    }
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    reset({
      type: transaction.type,
      name: transaction.name,
      amount: transaction.amount,
      category_id: transaction.category?.id,
      account_id: transaction.account?.id,
      frequency: transaction.frequency,
      start_date: transaction.start_date,
      end_date: transaction.end_date,
      is_active: true,
      note: transaction.note ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      sqlite.transactions.delete(id);
    }
  };
  const handleToggleActive = async (transaction: RecurringTransaction) => {
    sqlite.transactions.update({
      id: transaction.id,
      is_active: !transaction.is_active,
    });
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

  /*
    Show stats of

    - Active Transactions
    - Due Today
    - Monthly Value
  */
  const formRules = {
    name: 'Name is required',
    amount: 'Transaction Amount is required',
    account_id: 'Account is required',
    start_date: 'Start Date is required',
    end_date: 'End Date is required',
    category: 'Category is required',
    frequency: 'Frequency is required',
  };

  return (
    <>
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
      {/* Recurring Transactions List */}
      <div className="space-y-4">
        {recurringTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Repeat className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No recurring transactions set up</p>
            <p className="text-sm text-slate-500">Add recurring subscriptions, bills, or regular income</p>
            <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add Your First Transaction
            </Button>
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
                      {transaction.category?.emoji} {transaction.category?.name} •{transaction.account?.name}
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
                  <span>Next: {format(transaction.next_execution, 'MMM dd')}</span>
                </div>
              </div>

              {transaction.note && <p className="text-xs text-slate-500 mt-2">{transaction.note}</p>}
            </div>
          ))
        )}
      </div>
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingTransaction ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Netflix Subscription"
                  {...register('name', { required: formRules.name })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount', {
                    required: formRules.amount,
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                  })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-white"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: formRules.category }}
                  render={({ field: { onChange, value } }) => <CategoryPicker value={value} setValue={onChange} />}
                />
                <Controller
                  name="account_id"
                  control={control}
                  rules={{ required: formRules.account_id }}
                  render={({ field: { onChange, value } }) => (
                    <AccountPicker
                      label="From Account"
                      error={!!(errors as FieldErrors<CreateRecurringTransaction>)?.account_id}
                      value={value}
                      setValue={onChange}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Frequency</label>
                  <select
                    {...register('frequency', { required: formRules.frequency })}
                    className="w-full glass-input rounded-lg px-3 py-2 text-white"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <label className="block text-sm font-medium text-slate-300">
                    <CalendarIcon className="w-4 h-4 inline mr-2" />
                    Start Date
                  </label>
                  <Controller
                    name="start_date"
                    control={control}
                    rules={{ required: formRules.start_date }}
                    render={({ field: { onChange, value } }) => <Calendar value={value} setValue={onChange} />}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <label className="block text-sm font-medium text-slate-300">
                  <CalendarIcon className="w-4 h-4 inline mr-2" />
                  End Date (Optional)
                </label>
                <Controller
                  name="end_date"
                  control={control}
                  rules={{ required: formRules.end_date }}
                  render={({ field: { onChange, value } }) => <Calendar value={value} setValue={onChange} />}
                />
              </div>
              {/* Note Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Note (Optional)</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add a note about this transaction..."
                  {...register('note')}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                    reset(initialData);
                  }}
                  className="flex-1 glass-button px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!isValid}
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
    </>
  );
};
