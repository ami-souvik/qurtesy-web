import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import _ from 'lodash';
import { Calendar } from './calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { Plus, Edit3, Calendar as CalendarIcon, DollarSign, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { CategoryPicker } from './category-picker';
import { AccountPicker } from './account-picker';
import { Category, Account } from '../../types';
import { Transfer } from '../../sqlite';
import { sqlite } from '../../config';

export type TransactionFormProps = {
  id?: number;
  date: Date;
  amount: number;
  account_id?: number;
  note?: string;
  category_id?: number;
  category?: Category;
};

export type TransferFormProps = {
  id?: number;
  date: Date;
  amount: number;
  account_id: number;
  note?: string;
  transfer_account_id: number;
};

export function TransactionForm() {
  const categories = useMemo(() => sqlite.categories.get<Category>(), []);
  const accounts = useMemo(() => sqlite.accounts.get<Account>(), []);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get('type') as 'expense' | 'income' | 'transfer';
  const initialData: TransactionFormProps | TransferFormProps =
    type === 'transfer'
      ? {
          date: new Date(),
          amount: 0,
          account_id: accounts.length > 0 ? accounts[0]?.id : undefined,
          transfer_account_id: accounts.length > 0 ? accounts[0]?.id : undefined,
          note: '',
        }
      : {
          date: new Date(),
          amount: 0,
          account_id: accounts.length > 0 ? accounts[0]?.id : undefined,
          category_id: undefined,
          note: '',
        };
  if (params.get('id')) {
    initialData.id = Number(params.get('id'));
  }
  if (params.get('date')) {
    initialData.date = new Date(params.get('date') || '');
  }
  if (params.get('amount')) {
    initialData.amount = Number(params.get('amount'));
  }
  if (params.get('account_id') && type === 'transfer') {
    (initialData as TransferFormProps).account_id = Number(params.get('account_id'));
  }
  if (params.get('transfer_account_id') && type === 'transfer') {
    (initialData as TransferFormProps).transfer_account_id = Number(params.get('transfer_account_id'));
  }
  if (params.get('category_id') && type !== 'transfer') {
    const category_id: number = Number(params.get('category_id'));
    (initialData as TransactionFormProps).category_id = category_id;
    (initialData as TransactionFormProps).category = categories.filter((c) => c.id === category_id)[0];
  }
  if (params.get('account_id') && type !== 'transfer') {
    (initialData as TransactionFormProps).account_id = Number(params.get('account_id'));
  }
  if (params.get('note')) {
    initialData.note = decodeURIComponent(String(params.get('note')));
  }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<TransactionFormProps | TransferFormProps>({
    mode: 'onChange',
    defaultValues: initialData,
  });

  const onSuccess = () => {
    navigate(-1);
  };
  const onSubmit = async (data: TransferFormProps | TransactionFormProps) => {
    setIsLoading(true);
    setError(null);
    if (type === 'transfer') {
      const { date, ...rest } = data as TransferFormProps;
      try {
        Transfer.create({
          date,
          ...rest,
        });
        reset({
          id: undefined,
          date: new Date(),
          amount: 0,
          account_id: accounts[0]?.id,
          transfer_account_id: accounts[0]?.id,
        });
        onSuccess();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save transfer. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      const { id, date, category, ...rest } = data as TransactionFormProps;
      // Determine if this is an edit or create operation
      const isEditOperation = id && id > 0;
      try {
        if (isEditOperation) {
          sqlite.transactions.update({
            ...rest,
            id,
            type,
            date,
            category_id: category?.id,
          });
        } else {
          // Ensure we're creating a new transaction (no id)
          sqlite.transactions.create({
            ...rest,
            type,
            date,
            category_id: category?.id,
          });
        }
        // Reset form to initial clean state for new transactions
        if (!isEditOperation) {
          reset({
            id: undefined,
            date: new Date(),
            amount: 0,
            category_id: undefined,
            account_id: accounts.length > 0 ? accounts[0]?.id : undefined,
            note: '',
          });
        }
        onSuccess();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save transaction. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleDelete = (id: number) => {
    if (confirm('Do you want to delete this transaction?')) sqlite.transactions.delete(id);
  };
  const currentFormData = watch();
  const isEditing = !!(initialData?.id || currentFormData.id);
  const formRules = {
    date: 'Date is required',
    amount: 'Amount is required',
    account_id: type === 'transfer' ? 'From Account is required' : undefined,
    transfer_account_id: type === 'transfer' ? 'To Account is required' : undefined,
    category: type !== 'transfer' ? 'Category is required' : undefined,
  };
  return (
    <div className="space-y-2">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {!_.isEmpty(errors) &&
        Object.entries(errors).map(([key, error]) => (
          <p key={key} className="col-span-2 text-red-400 text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error?.message}
          </p>
        ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-118 space-y-2">
          {/* Hidden ID field for form state management */}
          <input type="hidden" {...register('id')} />
          {/* First Row - Date and Amount */}
          <div className="grid grid-cols-2 items-center">
            <label className="block text-sm font-medium text-slate-300">
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: formRules.date }}
              render={({ field: { onChange, value } }) => <Calendar value={value} setValue={onChange} />}
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.date.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 items-center">
            <label className="block text-sm font-medium text-slate-300">
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
                required: formRules.amount,
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
            />
          </div>
          {/* Second Row - Category and Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-2">
            {type === 'transfer' ? (
              <>
                <Controller
                  name="account_id"
                  control={control}
                  rules={{ required: formRules.account_id }}
                  render={({ field: { onChange, value } }) => (
                    <AccountPicker
                      label="From Account"
                      error={!!(errors as FieldErrors<TransferFormProps>)?.account_id}
                      value={value}
                      setValue={onChange}
                    />
                  )}
                />
                <Controller
                  name="transfer_account_id"
                  control={control}
                  rules={{ required: formRules.transfer_account_id }}
                  render={({ field: { onChange, value } }) => (
                    <AccountPicker
                      label="To Account"
                      error={!!(errors as FieldErrors<TransferFormProps>)?.transfer_account_id}
                      value={value}
                      setValue={onChange}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: formRules.category }}
                  render={({ field: { onChange, value } }) => (
                    <CategoryPicker value={value} setValue={onChange} filter={`type = '${type || 'expense'}'`} />
                  )}
                />
                <Controller
                  name="account_id"
                  control={control}
                  rules={{ required: formRules.account_id }}
                  render={({ field: { onChange, value } }) => (
                    <AccountPicker
                      label="Account"
                      error={!!(errors as FieldErrors<TransactionFormProps>)?.account_id}
                      value={value}
                      setValue={onChange}
                    />
                  )}
                />
              </>
            )}
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          {initialData?.id && (
            <button
              className="px-3 text-slate-400 text-red-400 bg-red-500/20 rounded-md transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                if (initialData?.id) handleDelete(initialData.id);
              }}
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`
              flex items-center sm:space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed
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
                <span className="ml-2 text-xs">Saving...</span>
              </>
            ) : isEditing ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Update</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
