import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { createTransfer } from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';

export type TransferFormProps = {
  date: Date;
  amount: number;
  from_account_id: number;
  to_account_id: number;
  note?: string;
};

export function TransferForm({ formRef }) {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts } = useSelector((state: RootState) => state.dailyExpenses);
  const { register, handleSubmit, control, reset } = useForm<TransferFormProps>();

  useEffect(() => {
    if (accounts.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        from_account_id: accounts[0]?.id,
        to_account_id: accounts[0]?.id,
      });
    }
  }, [accounts, reset]);

  const onSubmit = (data: TransferFormProps) => {
    const { date, ...rest } = data;
    dispatch(
      createTransfer({
        date: date.toLocaleDateString('en-GB'), // DD/MM/YYYY format
        ...rest,
      })
    );
    reset({
      date: new Date(),
      amount: 0,
      from_account_id: accounts[0]?.id,
      to_account_id: accounts[0]?.id,
    });
  };

  if (formRef && formRef.current) {
    formRef.current.set = (data: TransferFormProps) => {
      reset(data);
    };
    formRef.current.reset = () => {
      reset({
        date: new Date(),
        amount: 0,
        from_account_id: accounts[0]?.id,
        to_account_id: accounts[0]?.id,
      });
    };
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <ArrowLeftRight className="w-5 h-5" />
          <span>Transfer Funds</span>
        </h3>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              {...register('amount', { required: true, min: 0 })}
            />
          </div>
        </div>

        {/* Second Row - From and To Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From Account</label>
            <select
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('from_account_id', { required: true })}
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">To Account</label>
            <select
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('to_account_id', { required: true })}
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
            placeholder="Add a note about this transfer..."
            {...register('note')}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer Funds</span>
          </button>
        </div>
      </form>
    </div>
  );
}
