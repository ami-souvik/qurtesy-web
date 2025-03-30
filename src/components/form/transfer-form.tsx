import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import { MdOutlineAddBox, MdOutlineUpdate, MdCancel } from 'react-icons/md';
import { createTransfer, updateTransfer } from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';

export type TransferFormProps = {
  date: Date;
  amount: number;
  from_account: number;
  to_account: number;
};

export function TransferForm({ formRef }) {
  const dispatch = useDispatch<AppDispatch>();
  const { categoryGroups, accountGroups } = useSelector((state: RootState) => state.dailyExpenses);
  const { register, handleSubmit, control, watch, reset } = useForm<TransferFormProps>();
  useEffect(() => {
    if (categoryGroups.length > 0 && accountGroups.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        from_account: accountGroups[0].id,
        to_account: accountGroups[0].id,
      });
    }
  }, [categoryGroups, accountGroups, reset]);

  const onSubmit = (data: TransferFormProps) => {
    const { id, date, amount, from_account, to_account } = data;
    if (id) {
      dispatch(
        updateTransfer({
          id,
          date: date.toLocaleDateString(),
          amount: Number(amount),
          from_account: Number(from_account),
          to_account: Number(to_account),
        })
      );
    } else {
      dispatch(
        createTransfer({
          date: date.toLocaleDateString(),
          amount: Number(amount),
          from_account: Number(from_account),
          to_account: Number(to_account),
        })
      );
    }
    reset({
      date: new Date(),
      amount: 0,
      from_account: accountGroups[0].id,
      to_account: accountGroups[0].id,
    });
  };
  if (formRef) {
    formRef.current.set = (data: TransferFormProps) => {
      reset(data);
    };
    formRef.current.reset = () => {
      reset({
        date: new Date(),
        amount: 0,
        from_account: accountGroups[0].id,
        to_account: accountGroups[0].id,
      });
    };
  }
  return (
    <div className="gap-2 grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px]">
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
      <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('from_account')}>
        {accountGroups.map(({ id, value }) => (
          <option key={id} value={id}>
            {value}
          </option>
        ))}
      </select>
      <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('to_account')}>
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
            from_account: accountGroups[0].id,
            to_account: accountGroups[0].id,
          })
        }
      >
        {watch('id') && <MdCancel size={24} />}
      </button>
      <button className="flex items-center" onClick={handleSubmit(onSubmit)}>
        {watch('id') ? <MdOutlineUpdate size={24} /> : <MdOutlineAddBox size={24} />}
      </button>
    </div>
  );
}
