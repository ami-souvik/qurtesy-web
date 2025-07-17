import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar, ChevronUp, ChevronDown, PiggyBank, ArrowLeftRight } from 'lucide-react';
import {
  fetchTransactions,
  deleteTransaction,
  fetchCategories,
  fetchAccounts,
  setYearMonth,
  setSection,
} from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';
import { groupByDate } from '../../utils/transaction';
import { DAYS, MONTHS, formatdate } from '../../utils/datetime';
import { TransactionFormModal, type TransactionFormProps } from '../form/transaction-form-modal';
import { Modal } from '../ui/modal';
import { Transaction } from './transaction';
import { TransactionHeader } from './transaction-header';
import { useKeyboardShortcuts, commonShortcuts } from '../../hooks/useKeyboardShortcuts';

import { cn } from '../../utils/tailwind';
import { Section } from '../../types';

const sectionsMeta = {
  EXPENSE: {
    label: 'Expenses',
    icon: ChevronDown,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20 border-red-500/30',
  },
  INCOME: {
    label: 'Income',
    icon: ChevronUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20 border-emerald-500/30',
  },
  TRANSFER: {
    label: 'Transfers',
    icon: ArrowLeftRight,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
  },
  INVESTMENT: {
    label: 'Investments',
    icon: PiggyBank,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
  },
};

export const Transactions = forwardRef(function Transactions(_props, ref) {
  const dispatch = useDispatch<AppDispatch>();
  const { section, yearmonth, transactions } = useSelector((state: RootState) => state.dailyExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormProps | undefined>(undefined);

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
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [section, dispatch]);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [yearmonth, section, dispatch]);

  const handleSelect = (data: TransactionFormProps) => {
    setEditingTransaction(data);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([commonShortcuts.newTransaction(handleAdd), commonShortcuts.escape(handleClose)], true);

  useImperativeHandle(ref, () => ({
    handleAdd,
  }));

  const handleDelete = (id: number) => {
    if (confirm('Do you want to delete this transaction?')) dispatch(deleteTransaction(id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Month Navigation and Add Button */}
      <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <button
          onClick={prevMonth}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-slate-400" />
          <div className="flex items-center space-x-2">
            <select
              value={yearmonth[1]}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="text-xs px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i} className="bg-slate-800">
                  {m}
                </option>
              ))}
            </select>
            <select
              value={yearmonth[0]}
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-xs px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {yearrange(yearmonth[0], 10).map((y) => (
                <option key={y} value={y} className="bg-slate-800">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={nextMonth}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-auto">
        {groupByDate(transactions).length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <p>No transactions found for this period</p>
              <p className="text-sm text-slate-500 mt-1">Add your first transaction above</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Transaction Header with Search and Stats */}
            <TransactionHeader
              totalTransactions={transactions.length}
              totalAmount={transactions.reduce((sum, t) => sum + (t.credit ? 1 : -1) * t.amount, 0)}
              onSearch={(term) => console.log('Search:', term)}
              onSort={(field) => console.log('Sort by:', field)}
              onFilter={() => console.log('Filter clicked')}
            />
            {/* Transaction Groups */}
            <div className="space-y-4">
              {groupByDate(transactions).map(({ date, total, data }, i: number) => {
                const sectionDate = new Date(
                  Number(date.substring(6, 10)),
                  Number(date.substring(3, 5)) - 1,
                  Number(date.substring(0, 2))
                );

                return (
                  <div key={i} className="animate-slide-in mb-4">
                    {/* Compact Date Header */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-slate-800/10 border border-slate-700/20 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-md flex items-center justify-center">
                          <span className="text-blue-400 font-bold text-xs">{date.substring(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">
                            {DAYS[sectionDate.getDay()].substring(0, 3)}, {formatdate(sectionDate)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {data.length} item{data.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-sm">₹ {total.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Total</p>
                      </div>
                    </div>

                    {/* Compact Transactions List */}
                    <div className="space-y-2">
                      {data.map((v, i) => (
                        <Transaction key={i} data={v} handleSelect={handleSelect} handleDelete={handleDelete} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        size="md"
      >
        {/* Modern Tab Pills */}
        <div className="grid grid-cols-4 bg-slate-800/30 rounded-lg p-1">
          {['EXPENSE', 'INCOME', 'TRANSFER', 'INVESTMENT'].map((s: Section) => {
            const meta = sectionsMeta[s];
            const Icon = meta.icon;
            const isActive = section === s;
            return (
              <button
                key={s}
                className={`
                  relative px-3 py-2 rounded-md transition-all duration-200 flex justify-center items-center sm:space-x-1.5
                  ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
                onClick={() => dispatch(setSection(s))}
              >
                <Icon className={`${cn('w-4 h-4 text-center', meta.color)}`} />
                <span className="w-full text-xs font-medium hidden sm:inline">{meta.label}</span>
                {isActive && <div className="absolute inset-0 rounded-md ring-1 ring-white/20"></div>}
              </button>
            );
          })}
        </div>
        <TransactionFormModal initialData={editingTransaction} onSuccess={handleClose} />
      </Modal>
    </div>
  );
});
