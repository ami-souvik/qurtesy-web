import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { MdOutlineAddBox, MdOutlineUpdate, MdCancel } from 'react-icons/md';
import { createTransaction, updateTransaction } from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';

export type TransactionFormProps = {
  id?: number;
  date: Date;
  amount: number;
  category_group: number;
  category?: number;
  account_group: number;
  account?: number;
};

export function TransactionForm({ formRef }) {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryGroups, accountGroups } = useSelector((state: RootState) => state.dailyExpenses);
  const { register, handleSubmit, control, watch, reset } = useForm<TransactionFormProps>();
  useEffect(() => {
    if (categoryGroups.length > 0 && accountGroups.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        category_group: categoryGroups[0].id,
        account_group: accountGroups[0].id,
      });
    }
  }, [categoryGroups, accountGroups, reset]);

  const onSubmit = (data: TransactionFormProps) => {
    const { id, date, ...rest } = data;
    if (id) {
      dispatch(
        updateTransaction({
          id,
          date: date.toLocaleDateString(),
          ...rest,
        })
      );
    } else {
      dispatch(
        createTransaction({
          date: date.toLocaleDateString(),
          ...rest,
        })
      );
    }
    reset({
      date: new Date(),
      amount: 0,
      category_group: categoryGroups[0].id,
      account_group: accountGroups[0].id,
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
        category_group: categoryGroups[0].id,
        account_group: accountGroups[0].id,
      });
    };
  }
  return (
    <div className="gap-2 grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px] grid-rows-[24px_24px]">
      <div className="border border-[#687384] rounded">
        <Controller
          name="date"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <DatePicker dateFormat="dd/MM/YYYY" selected={value} onChange={onChange} />
          )}
        />
      </div>
      <div className="border border-[#687384] rounded">
        <input className="w-full h-full px-1 text-end" {...register('amount')} />
      </div>
      <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('category_group')}>
        {categoryGroups.map(({ id, value, emoji }) => (
          <option key={id} value={id}>
            {emoji} {value}
          </option>
        ))}
      </select>
      <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('account_group')}>
        {accountGroups.map(({ id, value }) => (
          <option key={id} value={id}>
            {value}
          </option>
        ))}
      </select>
      <button
        className="flex items-center"
        onClick={() =>
          reset({
            date: new Date(),
            amount: 0,
            category_group: categoryGroups[0].id,
            account_group: accountGroups[0].id,
          })
        }
      >
        {watch('id') && <MdCancel size={24} />}
      </button>
      <button className="flex items-center" onClick={handleSubmit(onSubmit)}>
        {watch('id') ? <MdOutlineUpdate size={24} /> : <MdOutlineAddBox size={24} />}
      </button>
      <div />
      <div />
      <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('category')}>
        {categoryGroups[0]?.categories?.map(({ id, value, emoji }) => (
          <option key={id} value={id}>
            {emoji} {value}
          </option>
        ))}
      </select>
      <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('account')}>
        {accountGroups[0]?.accounts?.map(({ id, value }) => (
          <option key={id} value={id}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
