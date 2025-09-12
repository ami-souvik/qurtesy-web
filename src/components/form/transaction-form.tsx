import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { Plus, Edit3, X, Calendar, DollarSign } from 'lucide-react';
import { RootState } from '../../store/index.types';
import { Transaction } from '../../sqlite';

export type TransactionFormProps = {
  id?: number;
  date: Date;
  amount: number;
  category_id?: number;
  account_id?: number;
  note?: string;
};

interface TransactionFormComponentProps {
  formRef: React.RefObject<HTMLFormElement>;
}

export function TransactionForm({ formRef }: TransactionFormComponentProps) {
  const { categories, accounts } = useSelector((state: RootState) => state.transactions);
  const { register, handleSubmit, control, watch, reset } = useForm<TransactionFormProps>();

  useEffect(() => {
    if (categories.length > 0 && accounts.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        category_id: categories[0]?.id,
        account_id: accounts[0]?.id,
      });
    }
  }, [categories, accounts, reset]);

  const onSubmit = (data: TransactionFormProps) => {
    const { id, date, ...rest } = data;
    if (id) {
      Transaction.update({
        id,
        date: date.toLocaleDateString('en-GB'), // DD/MM/YYYY format
        ...rest,
      });
    } else {
      Transaction.create({
        date: date.toLocaleDateString('en-GB'), // DD/MM/YYYY format
        ...rest,
      });
    }
    reset({
      date: new Date(),
      amount: 0,
      category_id: categories[0]?.id,
      account_id: accounts[0]?.id,
    });
  };

  if (formRef && formRef.current) {
    formRef.current.set = (data: TransactionFormProps) => {
      reset(data);
    };
    formRef.current.reset = () => {
      reset({
        date: new Date(),
        amount: 0,
        category_id: categories[0]?.id,
        account_id: accounts[0]?.id,
      });
    };
  }

  const isEditing = !!watch('id');

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h3>
        {isEditing && (
          <button
            type="button"
            onClick={() =>
              reset({
                date: new Date(),
                amount: 0,
                category_id: categories[0]?.id,
                account_id: accounts[0]?.id,
              })
            }
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

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
        <div className="flex justify-end">
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
    </div>
  );
}
