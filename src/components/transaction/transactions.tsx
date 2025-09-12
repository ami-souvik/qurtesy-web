import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, ArrowLeftRight, PiggyBank, LucideIcon } from 'lucide-react';
import { RootState } from '../../store/index.types';
import { groupByDate } from '../../utils/transaction';
import { DAYS, formatdate } from '../../utils/datetime';
import { type TransactionFormProps } from '../form/transaction-form-modal';
import { Modal } from '../ui/modal';
import { Transaction } from './transaction';
import { Transaction as TransactionTable } from '../../sqlite/transaction';
import { TransactionHeader } from './transaction-header';
import { TransactionYearMonth } from '../home/transaction-yearmonth';
import TransactionSticker from '../../assets/transactions.png';

import { cn } from '../../utils/tailwind';
import { PersonalFinanceSection } from '../../types';
import { EmptyScreen } from '../ui/empty-screen';

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
  const [section, setSection] = useState<PersonalFinanceSection>(PersonalFinanceSection.EXPENSE);
  const navigate = useNavigate();
  const location = useLocation();
  const showModal = location.pathname.startsWith('/transactions/modal');
  const { yearmonth } = useSelector((state: RootState) => state.transactions);
  const transactions = useMemo(() => {
    return TransactionTable.getByYearMonth(yearmonth[0], yearmonth[1]);
  }, [yearmonth]);

  const handleSelect = (data: TransactionFormProps) => {
    const { id, date, amount, category_id, account_id, note } = data;
    navigate(
      `modal/transaction?${createSearchParams({
        section,
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

  const handleAdd = (section: PersonalFinanceSection) => {
    navigate(`modal/transaction?${createSearchParams({ section })}`);
  };

  useImperativeHandle(ref, () => ({
    handleAdd,
  }));

  return (
    <div className="flex flex-col h-full">
      <TransactionYearMonth />
      {/* Transactions List */}
      <div className="flex-1 overflow-auto">
        {groupByDate(transactions).length === 0 ? (
          <EmptyScreen
            icon={
              <div className="w-32 h-32 mx-auto bg-slate-400/20 dark:bg-zinc-900/20 rounded-full opacity-70">
                <img src={TransactionSticker} className="grayscale-60" />
              </div>
            }
            title="No Transactions"
            subtitle="No transactions found for this period"
          />
        ) : (
          <div className="space-y-2">
            {/* Transaction Header with Search and Stats */}
            <TransactionHeader
              totalTransactions={transactions.length}
              totalAmount={transactions.reduce((sum, t) => sum + (t.credit ? 1 : -1) * t.amount, 0)}
              onSearch={(term) => console.log('Search:', term)}
              onSort={(field) => console.log('Sort by:', field)}
              onFilter={() => console.log('Filter clicked')}
            />
            {/* Transaction Groups */}
            <div className="space-y-2">
              {groupByDate(transactions).map(({ date, total, data }, i: number) => {
                const sectionDate = new Date(date);
                return (
                  <div key={i} className="animate-slide-in mb-4 glass-card rounded-2xl">
                    {/* Compact Date Header */}
                    <div className="flex items-center justify-between px-6 pt-4 pb-2">
                      <div className="flex items-center space-x-4">
                        <p className="font-medium text-sm">
                          {DAYS[sectionDate.getDay()].substring(0, 3)}, {formatdate(sectionDate)}
                        </p>
                        <p className="text-sm text-slate-400">
                          {data.length} item{data.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">₹ {total.toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Compact Transactions List */}
                    <div className="px-6">
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
      <Modal isOpen={showModal} onClose={handleClose} title="Add/Edit Transaction" size="md">
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
                onClick={() => setSection(s)}
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
