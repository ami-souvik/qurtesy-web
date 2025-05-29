import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
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
import { TransactionFormModal, type TransactionFormProps } from '../form/transaction-form-modal';
import { Modal } from '../ui/modal';
import { Transaction } from './transaction';

export function Transactions() {
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  const handleOpenNewTransaction = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

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
              className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            onClick={handleOpenNewTransaction}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-auto space-y-6">
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
          groupByDate(transactions).map(({ date, total, data }, i: number) => {
            const sectionDate = new Date(
              Number(date.substring(6, 10)),
              Number(date.substring(3, 5)) - 1,
              Number(date.substring(0, 2))
            );

            return (
              <div key={i} className="animate-slide-in">
                {/* Date Header */}
                <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/20 border border-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">{date.substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {DAYS[sectionDate.getDay()].substring(0, 3)}, {formatdate(sectionDate)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {data.length} transaction{data.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹ {total.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Total</p>
                  </div>
                </div>

                {/* Transactions for this date */}
                <div className="space-y-2 ml-6">
                  {data.map((v, i) => (
                    <Transaction key={i} data={v} handleSelect={handleSelect} handleDelete={handleDelete} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        size="md"
      >
        <TransactionFormModal initialData={editingTransaction} onSuccess={handleCloseModal} />
      </Modal>
    </div>
  );
}
