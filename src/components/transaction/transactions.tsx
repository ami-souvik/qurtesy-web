import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ChevronUp, ChevronDown, PiggyBank, ArrowLeftRight, LucideIcon } from 'lucide-react';
import { fetchTransactions, fetchCategories, fetchAccounts, setSection } from '../../slices/daily-expenses-slice';
import { AppDispatch, RootState } from '../../store.types';
import { groupByDate } from '../../utils/transaction';
import { DAYS, formatdate } from '../../utils/datetime';
import { type TransactionFormProps } from '../form/transaction-form-modal';
import { Modal } from '../ui/modal';
import { Transaction } from './transaction';
import { TransactionHeader } from './transaction-header';
import { TransactionYearMonth } from '../home/transaction-yearmonth';
import { useKeyboardShortcuts, commonShortcuts } from '../../hooks/useKeyboardShortcuts';

import { cn } from '../../utils/tailwind';
import { PersonalFinanceSection } from '../../types';

type SectionMeta = {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
};

const sectionsMeta: Record<PersonalFinanceSection, SectionMeta> = {
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
  const navigate = useNavigate();
  const location = useLocation();
  const pathend = location.pathname.split('/').pop();
  const { section, yearmonth, transactions } = useSelector((state: RootState) => state.dailyExpenses);

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
    const { id, date, amount, category_id, account_id, note } = data;
    navigate(
      `modal?${createSearchParams({
        date: date.toISOString(),
        amount: amount.toString(),
        ...(id && { id: id.toString() }),
        ...(category_id && { category_id: category_id.toString() }),
        ...(account_id && { account_id: account_id.toString() }),
        ...(note && { note }),
      })}`
    );
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleAdd = () => {
    navigate('modal');
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([commonShortcuts.newTransaction(handleAdd), commonShortcuts.escape(handleClose)], true);

  useImperativeHandle(ref, () => ({
    handleAdd,
  }));

  return (
    <div className="flex flex-col h-full">
      <TransactionYearMonth />
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
                        <Transaction key={i} data={v} handleSelect={handleSelect} />
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
      <Modal isOpen={pathend === 'modal'} onClose={handleClose} title="Add/Edit Transaction" size="md">
        {/* Modern Tab Pills */}
        <div className="my-2 grid grid-cols-4 bg-slate-800/30 rounded-lg">
          {(Object.keys(sectionsMeta) as PersonalFinanceSection[]).map((s: PersonalFinanceSection) => {
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
        <Outlet />
      </Modal>
    </div>
  );
});
