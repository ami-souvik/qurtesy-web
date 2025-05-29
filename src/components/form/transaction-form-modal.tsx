import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { Plus, Edit3, Calendar, DollarSign } from 'lucide-react';
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
  const { register, handleSubmit, control, watch, reset } = useForm<TransactionFormProps>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else if (categories.length > 0 && accounts.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        category_id: categories[0]?.id,
        account_id: accounts[0]?.id,
      });
    }
  }, [categories, accounts, initialData, reset]);

  const onSubmit = async (data: TransactionFormProps) => {
    const { id, date, ...rest } = data;
    try {
      if (id) {
        await dispatch(
          updateTransaction({
            id,
            date: date.toLocaleDateString('en-GB'), // DD/MM/YYYY format
            ...rest,
          })
        ).unwrap();
      } else {
        await dispatch(
          createTransaction({
            date: date.toLocaleDateString('en-GB'), // DD/MM/YYYY format
            ...rest,
          })
        ).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };
  const isEditing = !!watch('id');

  return (
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
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={value}
                onChange={onChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            {...register('amount', { required: true, min: 0 })}
          />
        </div>
      </div>
      {/* Second Row - Category and Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('category_id')}
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
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Account</label>
          <select
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('account_id')}
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
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
            ${
              isEditing
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            }
          `}
        >
          {isEditing ? (
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
  );
}
