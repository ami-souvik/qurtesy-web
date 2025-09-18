import { Calendar, Wallet } from 'lucide-react';
import { CreateTransaction, type Transaction as TransactionType } from '../../types';

export function Transaction({
  data,
  handleSelect,
}: {
  data: TransactionType;
  handleSelect: (v: CreateTransaction) => void;
}) {
  return (
    <div
      className="group relative py-4 border-t border-zinc-300 dark:border-zinc-700 transition-all duration-200 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        handleSelect({
          ...data,
        });
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Category and condensed info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Category Icon */}
          <div className="flex-shrink-0">
            {data.category.emoji ? (
              <div className="w-12 h-12 bg-slate-400/20 dark:bg-slate-700/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{data.category.emoji}</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-slate-500/20 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-xl truncate">{data.category.name || 'No category'}</h4>
              </div>
              <span className="text-lg font-bold ml-2">
                ₹ {data.type === 'expense' && '-'}
                {data.amount}
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500 space-x-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {data.date.toLocaleTimeString([], {
                    day: 'numeric',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Wallet className="w-3 h-3" />
                <span className="truncate">{data.account.name || 'No account'}</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-500/20 dark:bg-slate-700/50 rounded-full text-xs uppercase">
                {data.type}
              </span>
            </div>

            {data.note && (
              <p className="mt-2 text-xs text-zinc-700 dark:text-slate-300 bg-slate-400/20 dark:bg-slate-700/20 px-2 py-1 rounded text-truncate italic">
                {data.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
