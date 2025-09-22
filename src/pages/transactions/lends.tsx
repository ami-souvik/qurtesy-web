import { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from 'react';
import { Check, Clock, Trash2, HandCoins, Filter, LucideIcon } from 'lucide-react';
import { DAYS, formatdate } from '../../utils/datetime';
import { LendFormModal } from '../../components/form/lend-form-modal';
import { Modal } from '../../components/ui/modal';
import { LendTransaction } from '../../types';
import { cn } from '../../utils/tailwind';
import { TransactionYearMonth } from '../../components/home/transaction-yearmonth';
import { EmptyScreen } from '../../components/ui/empty-screen';

export const Lends = forwardRef(function Lends(_props, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lends, setLends] = useState<LendTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'repaid'>('all');

  const fetchLendTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const { getLendTransactions } = await import('../../webservices/daily-expenses-ws');
      const statusParam = statusFilter === 'all' ? undefined : statusFilter;
      const lendData = await getLendTransactions(statusParam);
      setLends(lendData);
    } catch (error) {
      console.error('Failed to fetch lend transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchLendTransactions();
  }, [fetchLendTransactions]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    handleClose();
    fetchLendTransactions(); // Refresh the list
  };

  useImperativeHandle(ref, () => ({
    handleAdd,
  }));

  const handleMarkAsRepaid = async (lendId: number, isRepaid: boolean) => {
    try {
      const { updateLendRepaymentStatus } = await import('../../webservices/daily-expenses-ws');
      await updateLendRepaymentStatus(lendId, {
        is_repaid: isRepaid,
        repaid_date: isRepaid ? new Date().toLocaleDateString('en-GB') : undefined,
      });
      fetchLendTransactions(); // Refresh to see changes
    } catch (error) {
      console.error('Failed to update repayment status:', error);
    }
  };

  const handleDeleteLend = async (lendId: number) => {
    if (confirm('Do you want to delete this lend transaction?')) {
      try {
        const { deleteLendTransaction } = await import('../../webservices/daily-expenses-ws');
        await deleteLendTransaction(lendId);
        fetchLendTransactions(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete lend transaction:', error);
      }
    }
  };

  // Group lends by date
  const groupLendsByDate = (lends: LendTransaction[]) => {
    const grouped: { [date: string]: LendTransaction[] } = {};

    lends.forEach((lend) => {
      if (!grouped[lend.date]) {
        grouped[lend.date] = [];
      }
      grouped[lend.date].push(lend);
    });

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        data,
        total: data.reduce((sum, lend) => sum + lend.amount, 0),
        pending: data.filter((lend) => !lend.is_repaid).reduce((sum, lend) => sum + lend.amount, 0),
      }))
      .sort(
        (a, b) =>
          new Date(b.date.split('/').reverse().join('-')).getTime() -
          new Date(a.date.split('/').reverse().join('-')).getTime()
      );
  };

  const filteredLends =
    statusFilter === 'all'
      ? lends
      : lends.filter((lend) => (statusFilter === 'pending' ? !lend.is_repaid : lend.is_repaid));

  const totalPending = lends.filter((lend) => !lend.is_repaid).reduce((sum, lend) => sum + lend.amount, 0);
  const totalRepaid = lends.filter((lend) => lend.is_repaid).reduce((sum, lend) => sum + lend.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading lend transactions...</div>
      </div>
    );
  }

  const SummaryTile = ({
    icon: Icon,
    color,
    label,
    amount,
  }: {
    icon: LucideIcon;
    color: string;
    label: string;
    amount: string;
  }) => (
    <div className="p-3 bg-slate-800/20 border border-slate-700/30 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className={cn('w-4 h-4 text-amber-400', color)} />
        <p className="text-xs text-slate-400">{label}</p>
      </div>
      <p className={cn('text-xl font-bold', color)}>₹{amount}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <TransactionYearMonth />
      {/* Header with Month Navigation and Stats */}
      <div className="mb-6 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          <SummaryTile icon={Clock} color="text-amber-400" label="Pending" amount={totalPending.toLocaleString()} />
          <SummaryTile icon={Check} color="text-green-400" label="Repaid" amount={totalRepaid.toLocaleString()} />
          <SummaryTile
            icon={HandCoins}
            color="text-cyan-400"
            label="Total Lent"
            amount={(totalPending + totalRepaid).toLocaleString()}
          />
        </div>

        {/* Filter Options */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'repaid')}
            className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Lends</option>
            <option value="pending">Pending Only</option>
            <option value="repaid">Repaid Only</option>
          </select>
        </div>
      </div>

      {/* Lend Form Modal */}
      <Modal isOpen={isModalOpen} onClose={handleClose} title="Create Lend Transaction" size="lg">
        <LendFormModal onSuccess={handleSuccess} />
      </Modal>

      {/* Lends List */}
      <div className="flex-1 overflow-auto space-y-6">
        {filteredLends.length === 0 ? (
          <EmptyScreen
            icon={
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-slate-400/20 dark:bg-zinc-900/20 rounded-full opacity-70">
                <HandCoins className="w-12 h-12" />
              </div>
            }
            title="No Lend Transactions"
            subtitle="No lend transactions found for this period"
          />
        ) : (
          groupLendsByDate(filteredLends).map(({ date, total, pending, data }, i: number) => {
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
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 font-bold text-sm">{date.substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {DAYS[sectionDate.getDay()].substring(0, 3)}, {formatdate(sectionDate)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {data.length} lend{data.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹ {total.toLocaleString()}</p>
                    {pending > 0 && <p className="text-xs text-amber-400">₹ {pending.toFixed(2)} pending</p>}
                  </div>
                </div>

                {/* Lends for this date */}
                <div className="space-y-4">
                  {data.map((lend) => (
                    <div
                      key={lend.id}
                      className="group bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-4 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <HandCoins className="w-5 h-5 text-cyan-400" />
                            <div>
                              <h3 className="font-medium text-white text-sm">Lent to {lend.borrower_profile.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-slate-400">
                                {lend.category && (
                                  <span>
                                    {lend.category.emoji} {lend.category.name}
                                  </span>
                                )}
                                {lend.account && <span>• via {lend.account.name}</span>}
                                {lend.created_from_split && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                    From Split
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {lend.note && (
                            <p className="mt-2 ml-8 text-xs text-slate-300 bg-slate-700/30 px-2 py-1 rounded text-truncate italic">
                              {lend.note}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">₹ {lend.amount.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">
                              {lend.is_repaid ? (
                                <span className="text-green-400 flex items-center">
                                  <Check className="w-3 h-3 mr-1" />
                                  Repaid {lend.repaid_date && `on ${lend.repaid_date}`}
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleMarkAsRepaid(lend.id, !lend.is_repaid)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                lend.is_repaid
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              }`}
                            >
                              {lend.is_repaid ? 'Mark Pending' : 'Mark Repaid'}
                            </button>
                            {!lend.created_from_split && (
                              <button
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                onClick={() => handleDeleteLend(lend.id)}
                                title="Delete lend"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
