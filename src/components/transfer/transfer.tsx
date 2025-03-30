import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { MdEdit, MdOutlineArrowCircleLeft, MdOutlineArrowCircleRight, MdDeleteOutline } from 'react-icons/md';
import {
  fetchTransactions,
  deleteTransaction,
  fetchCategories,
  fetchAccounts,
  setYearMonth,
} from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';
import { groupByDate } from '../../utils/transaction';
import { DAYS, MONTHS, formatdate } from '../../utils/datetime';
import { TransferForm, type TransferFormProps } from '../form/transfer-form';
import { TransferHead } from './transfer-head';

export function Transfer() {
  const dispatch = useDispatch<AppDispatch>();
  const { section, accountGroups, yearmonth, transactions } = useSelector((state: RootState) => state.dailyExpenses);
  const formRef = useRef();
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
  const { reset } = useForm<TransferFormProps>();

  useEffect(() => {
    if (accountGroups.length > 0) {
      reset({
        date: new Date(),
        amount: 0,
        from_account: accountGroups[0].id,
        to_account: accountGroups[0].id,
      });
    }
  }, [accountGroups, reset]);
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
      <TransferHead />
      <TransferForm formRef={formRef} />
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
                  {v.category_group?.emoji} {v.category_group.value}
                </p>
                <p className="p-1">{v.account_group.value}</p>
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
