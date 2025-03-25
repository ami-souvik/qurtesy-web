import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker-extra.css';
import {
  MdEdit,
  MdOutlineArrowCircleLeft,
  MdOutlineArrowCircleRight,
  MdOutlineAddBox,
  MdOutlineUpdate,
  MdDeleteOutline,
  MdCancel,
} from 'react-icons/md';
import {
  fetchTransactions,
  updateTransaction,
  deleteTransaction,
  fetchCategories,
  fetchAccounts,
  setYearMonth,
  createTransfer,
} from '../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../store.types';
import { groupByDate } from '../utils/transaction';
import { DAYS, MONTHS, formatdate } from '../utils/datetime';
import { AccountForm } from './account-form';

type TransferForm = {
  id?: number;
  date: Date;
  amount: number;
  from_account: number;
  to_account: number;
};

export function Transfer() {
  const dispatch = useDispatch<AppDispatch>();
  const { section, categories, accounts, yearmonth, transactions } = useSelector(
    (state: RootState) => state.dailyExpenses
  );
  const setMonth = (m: number) => dispatch(setYearMonth([yearmonth[0], m]));
  const setYear = (y: number) => dispatch(setYearMonth([y, yearmonth[1]]));
  const yearrange = (year: number, range: number) => {
    let state = year - range;
    const years = [state];
    while (state < year + range) {
      state += 1;
      years.push(state);
    }
    return years;
  };
  const nextMonth = () => {
    if (Number(yearmonth[1]) === 11) dispatch(setYearMonth([yearmonth[0] + 1, 0]));
    else dispatch(setYearMonth([yearmonth[0], yearmonth[1] + 1]));
  };
  const prevMonth = () => {
    if (Number(yearmonth[1]) === 0) dispatch(setYearMonth([yearmonth[0] - 1, 11]));
    else dispatch(setYearMonth([yearmonth[0], yearmonth[1] - 1]));
  };
  useEffect(() => {
    dispatch(fetchAccounts());
  }, []);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [section]);
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [yearmonth, section]);
  const { register, handleSubmit, control, watch, reset } = useForm<TransferForm>();

  useEffect(() => {
    if (categories.length > 0 && accounts.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        from_account: categories[0].id,
        to_account: accounts[0].id,
      });
    }
  }, [categories, accounts, reset]);

  const onSubmit = (data: TransferForm) => {
    const { id, date, amount, from_account, to_account } = data;
    if (id) {
      dispatch(
        updateTransaction({
          id,
          date: date.toLocaleDateString(),
          amount: Number(amount),
          account: Number(to_account),
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
      from_account: accounts[0].id,
      to_account: accounts[0].id,
    });
  };
  const handleDelete = (id: number) => {
    if (confirm('Do you want to delete this transaction?')) dispatch(deleteTransaction(id));
  };
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex justify-between">
        <button onClick={prevMonth}>
          <MdOutlineArrowCircleLeft size={24} />
        </button>
        <div className="flex gap-1">
          <select value={yearmonth[1]} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select value={yearmonth[0]} onChange={(e) => setYear(Number(e.target.value))}>
            {yearrange(yearmonth[0], 10).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <button onClick={nextMonth}>
          <MdOutlineArrowCircleRight size={24} />
        </button>
      </div>
      <div className="py-1 grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px] bg-[#1e2329] rounded-md">
        <p className="px-1 text-xs font-bold">Date</p>
        <p className="px-1 text-xs font-bold">Amount</p>
        <p className="px-1 text-xs font-bold">From Account</p>
        <p className="px-1 text-xs font-bold">To Account</p>
        <div></div>
        <div></div>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px]">
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
        <div className="flex h-full">
          <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('from_account')}>
            {accounts.map(({ id, value }) => (
              <option key={id} value={id}>
                {value}
              </option>
            ))}
          </select>
          <AccountForm />
        </div>
        <div className="flex">
          <select className="w-full h-full px-1 border border-[#687384] rounded" {...register('to_account')}>
            {accounts.map(({ id, value }) => (
              <option key={id} value={id}>
                {value}
              </option>
            ))}
          </select>
          <AccountForm />
        </div>
        <button
          className="flex items-center"
          onClick={() =>
            reset({
              date: new Date(),
              amount: 0,
              from_account: categories[0].id,
              to_account: accounts[0].id,
            })
          }
        >
          {watch('id') && <MdCancel size={24} />}
        </button>
        <button className="flex items-center" onClick={handleSubmit(onSubmit)}>
          {watch('id') ? <MdOutlineUpdate size={24} /> : <MdOutlineAddBox size={24} />}
        </button>
      </div>
      {groupByDate(transactions).map(({ date, total, data }, i: number) => {
        const sectionDate = new Date(
          Number(date.substring(6, 10)),
          Number(date.substring(3, 5)) - 1,
          Number(date.substring(0, 2))
        );
        return (
          <div key={i}>
            <div className="flex justify-between border-[#687384] border-b mt-3">
              <p>
                {date.substring(0, 2)} {DAYS[sectionDate.getDay()].substring(0, 3)}, {formatdate(sectionDate)}
              </p>
              <p>₹ {total}</p>
            </div>
            {data.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_24px_24px] border-[#20242a] border-b">
                <p className="p-1 text-right">{String(v.date)}</p>
                <p className="p-1 text-right">
                  ₹ {!v.credit && '-'} {v.amount}
                </p>
                <p className="p-1">
                  {v.category?.emoji} {v.category.value}
                </p>
                <p className="p-1">{v.account.value}</p>
                <button
                  className="h-full px-1 flex items-center"
                  onClick={() =>
                    reset({
                      id: v.id,
                      date: new Date(
                        Number(v.date.substring(6, 10)),
                        Number(v.date.substring(3, 5)) - 1,
                        Number(v.date.substring(0, 2))
                      ),
                      amount: v.amount,
                      from_account: v.category.id,
                      to_account: v.account.id,
                    })
                  }
                >
                  <MdEdit size={18} />
                </button>
                <button onClick={() => handleDelete(v.id)}>
                  <MdDeleteOutline size={24} />
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
