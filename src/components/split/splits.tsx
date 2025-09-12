import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Users, Check, Clock, Trash2 } from 'lucide-react';
import { DAYS, formatdate } from '../../utils/datetime';
import { SplitFormModal } from '../form/split-form-modal';
import { Modal } from '../ui/modal';
import { SplitTransaction } from '../../types/transaction';
import { TransactionYearMonth } from '../home/transaction-yearmonth';
import { EmptyScreen } from '../ui/empty-screen';
import SplitSticker from '../../assets/splits.png';

export const Splits = forwardRef(function Splits(_props, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [splits, setSplits] = useState<SplitTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSplitTransactions = async () => {
    try {
      setLoading(true);
      const { getSplitTransactions } = await import('../../webservices/daily-expenses-ws');
      const splitData = await getSplitTransactions();
      setSplits(splitData);
    } catch (error) {
      console.error('Failed to fetch split transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSplitTransactions();
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    handleClose();
    fetchSplitTransactions(); // Refresh the list
  };

  useImperativeHandle(ref, () => ({
    handleAdd,
  }));

  const handleMarkAsPaid = async (splitId: number, participantId: number, isPaid: boolean) => {
    try {
      const { updateParticipantPaymentStatus } = await import('../../webservices/daily-expenses-ws');
      await updateParticipantPaymentStatus(splitId, participantId, isPaid);
      fetchSplitTransactions(); // Refresh to see changes
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleDeleteSplit = async (splitId: number) => {
    if (confirm('Do you want to delete this split transaction?')) {
      try {
        const { deleteSplitTransaction } = await import('../../webservices/daily-expenses-ws');
        await deleteSplitTransaction(splitId);
        fetchSplitTransactions(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete split transaction:', error);
      }
    }
  };

  // Group splits by date
  const groupSplitsByDate = (splits: SplitTransaction[]) => {
    const grouped: { [date: string]: SplitTransaction[] } = {};

    splits.forEach((split) => {
      if (!grouped[split.date]) {
        grouped[split.date] = [];
      }
      grouped[split.date].push(split);
    });

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        data,
        total: data.reduce((sum, split) => sum + split.total_amount, 0),
      }))
      .sort(
        (a, b) =>
          new Date(b.date.split('/').reverse().join('-')).getTime() -
          new Date(a.date.split('/').reverse().join('-')).getTime()
      );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading split transactions...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TransactionYearMonth />

      {/* Split Form Modal */}
      <Modal isOpen={isModalOpen} onClose={handleClose} title="Create Split Transaction" size="lg">
        <SplitFormModal onSuccess={handleSuccess} />
      </Modal>

      {/* Splits List */}
      <div className="flex-1 overflow-auto space-y-6">
        {splits.length === 0 ? (
          <EmptyScreen
            icon={
              <div className="w-32 h-32 mx-auto bg-slate-400/20 dark:bg-zinc-900/20 rounded-full opacity-70">
                <img src={SplitSticker} className="grayscale-60" />
              </div>
            }
            title="No Split Transactions"
            subtitle="No split transactions found for this period"
          />
        ) : (
          groupSplitsByDate(splits).map(({ date, total, data }, i: number) => {
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
                        {data.length} split{data.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹ {total.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Total</p>
                  </div>
                </div>

                {/* Splits for this date */}
                <div className="space-y-4 ml-6">
                  {data.map((split) => (
                    <div
                      key={split.id}
                      className="group bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-4 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Users className="w-5 h-5 text-cyan-400" />
                            <div>
                              <h3 className="font-medium text-white text-lg">{split.name}</h3>
                              <p className="text-sm text-slate-400">
                                {split.category?.emoji} {split.category?.value} • Paid by{' '}
                                {split.created_by_account.value}
                              </p>
                            </div>
                          </div>
                          {split.note && <p className="text-sm text-slate-300 mt-2 ml-8">{split.note}</p>}
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">₹ {split.total_amount.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">
                              {split.is_settled ? (
                                <span className="text-green-400 flex items-center">
                                  <Check className="w-3 h-3 mr-1" />
                                  Settled
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />₹{split.total_pending.toFixed(2)} pending
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                              onClick={() => handleDeleteSplit(split.id)}
                              title="Delete split"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="border-t border-slate-600/50 pt-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Participants</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {split.participants.map((participant) => (
                            <div
                              key={participant.id}
                              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium text-white">{participant.profile.name}</p>
                                <p className="text-xs text-slate-400">₹{participant.share_amount.toFixed(2)}</p>
                              </div>
                              <button
                                onClick={() => handleMarkAsPaid(split.id, participant.id!, !participant.is_paid)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  participant.is_paid
                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                    : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                }`}
                              >
                                {participant.is_paid ? 'Paid' : 'Pending'}
                              </button>
                            </div>
                          ))}
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
