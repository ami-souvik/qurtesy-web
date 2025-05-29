import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { Plus, Edit3, Calendar, DollarSign, Loader2, Clock, AlertCircle } from 'lucide-react';
import { createTransaction, updateTransaction } from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';

export type TransactionFormProps = {
  id?: number;
  date: Date;
  amount: number;
  category_id?: number;
  account_id?: number;
  note?: string;
};

interface TransactionFormModalProps {
  initialData?: TransactionFormProps;
  onSuccess: () => void;
}
export function TransactionFormModal({ initialData, onSuccess }: TransactionFormModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, accounts } = useSelector((state: RootState) => state.dailyExpenses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<TransactionFormProps[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<TransactionFormProps>({
    mode: 'onChange',
  });

  // Auto-save draft functionality
  const watchedData = watch();

  useEffect(() => {
    if (!initialData && watchedData.amount > 0) {
      const draftKey = 'transaction-draft';
      const draftData = {
        ...watchedData,
        date: watchedData.date?.toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 2000);
    }
  }, [watchedData, initialData]);

  // Load recent transactions for quick-fill
  useEffect(() => {
    const loadRecentTransactions = () => {
      const recent = JSON.parse(localStorage.getItem('recent-transactions') || '[]');
      setRecentTransactions(recent.slice(0, 3));
    };
    loadRecentTransactions();
  }, []);

  // Load draft on mount
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      // Try to load draft
      const draftKey = 'transaction-draft';
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.date) draft.date = new Date(draft.date);
          reset(draft);
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      } else if (categories.length > 0 && accounts.length > 0) {
        reset({
          date: new Date(),
          amount: 0,
          category_id: categories[0]?.id,
          account_id: accounts[0]?.id,
        });
      }
    }
  }, [categories, accounts, initialData, reset]);
  const onSubmit = async (data: TransactionFormProps) => {
    setIsLoading(true);
    setError(null);

    const { id, date, ...rest } = data;
    try {
      if (id) {
        await dispatch(
          updateTransaction({
            id,
            date: date.toLocaleDateString('en-GB'),
            ...rest,
          })
        ).unwrap();
      } else {
        await dispatch(
          createTransaction({
            date: date.toLocaleDateString('en-GB'),
            ...rest,
          })
        ).unwrap();

        // Save to recent transactions
        const recent = JSON.parse(localStorage.getItem('recent-transactions') || '[]') as TransactionFormProps[];
        const newRecent = [
          data,
          ...recent.filter(
            (t: TransactionFormProps) => !(t.category_id === data.category_id && t.account_id === data.account_id)
          ),
        ].slice(0, 5);
        localStorage.setItem('recent-transactions', JSON.stringify(newRecent));

        // Clear draft
        localStorage.removeItem('transaction-draft');
      }
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save transaction. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const quickFillFromRecent = (recent: TransactionFormProps) => {
    setValue('category_id', recent.category_id);
    setValue('account_id', recent.account_id);
    setValue('note', recent.note);
    setValue('amount', recent.amount);
  };

  const isEditing = !!watch('id');
  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Draft Save Indicator */}
      {isDraftSaved && !isEditing && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2 flex items-center space-x-2 text-green-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs">Draft saved automatically</span>
        </div>
      )}

      {/* Recent Transactions Quick Fill */}
      {!isEditing && recentTransactions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Fill from Recent</h4>
          <div className="grid grid-cols-1 gap-2">
            {recentTransactions.map((recent, index) => {
              const category = categories.find((c) => c.id === recent.category_id);
              const account = accounts.find((a) => a.id === recent.account_id);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => quickFillFromRecent(recent)}
                  className="flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category?.emoji}</span>
                    <div>
                      <p className="text-sm text-white">{category?.value}</p>
                      <p className="text-xs text-slate-400">{account?.value}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">₹{recent.amount}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Row - Date and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={value}
                  onChange={onChange}
                  className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                />
              )}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              placeholder="0.00"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>
        {/* Second Row - Category and Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category_id ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              {...register('category_id', { required: 'Category is required' })}
            >
              <option value="" className="bg-slate-800">
                Select category
              </option>
              {categories.map(({ id, value, emoji }) => (
                <option key={id} value={id} className="bg-slate-800">
                  {emoji} {value}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Account</label>
            <select
              className={`w-full px-4 py-2 bg-slate-700/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.account_id ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              {...register('account_id', { required: 'Account is required' })}
            >
              <option value="" className="bg-slate-800">
                Select account
              </option>
              {accounts.map(({ id, value }) => (
                <option key={id} value={id} className="bg-slate-800">
                  {value}
                </option>
              ))}
            </select>
            {errors.account_id && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.account_id.message}
              </p>
            )}
          </div>
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

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isEditing
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Update Transaction</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
