import { Edit3, Trash2, Calendar, Wallet } from 'lucide-react';
import { type Transaction as TransactionType } from '../../types';
import { TransactionFormProps } from '../form/transaction-form-modal';

export function Transaction({
  data,
  handleSelect,
  handleDelete,
}: {
  data: TransactionType;
  handleSelect: (v: TransactionFormProps) => void;
  handleDelete: (id: number) => void;
}) {
  return (
    <div className="group relative bg-slate-800/20 hover:bg-slate-700/30 border border-slate-700/30 hover:border-slate-600/50 rounded-lg p-3 transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        {/* Left side - Category and condensed info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Category Icon */}
          <div className="flex-shrink-0">
            {data.category ? (
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{data.category.emoji}</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-white text-sm truncate">{data.category?.value || 'No category'}</h4>
              <span className="text-lg font-bold text-white ml-2">
                ₹ {!data.credit && '-'}
                {data.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center text-xs text-slate-400 space-x-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{String(data.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wallet className="w-3 h-3" />
                <span className="truncate">{data.account?.value || 'No account'}</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-700/50 rounded-full text-xs capitalize">
                {data.section.toLowerCase()}
              </span>
            </div>

            {data.note && (
              <p className="mt-2 text-xs text-slate-300 bg-slate-700/30 px-2 py-1 rounded text-truncate italic">
                {data.note}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
          <button
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-md transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect({
                id: data.id,
                date: new Date(
                  Number(data.date.substring(6, 10)),
                  Number(data.date.substring(3, 5)) - 1,
                  Number(data.date.substring(0, 2))
                ),
                amount: data.amount,
                category_id: data.category?.id,
                account_id: data.account?.id,
                note: data.note,
              });
            }}
            title="Edit transaction"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(data.id);
            }}
            title="Delete transaction"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
