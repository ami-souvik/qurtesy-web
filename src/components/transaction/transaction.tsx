import { Edit3, Trash2 } from 'lucide-react';
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
    <div className="group bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-4 mb-3 transition-all duration-200">
      <div className="flex items-center justify-between">
        {/* Left side - Category and Account info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              {data.category && (
                <>
                  <span className="text-lg">{data.category.emoji}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{data.category.value}</p>
                  </div>
                </>
              )}
              {!data.category && (
                <div>
                  <p className="font-medium text-slate-400 text-sm italic">No category</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>
              {data.account?.value || 'No account'} • {String(data.date)}
            </span>
          </div>

          {data.note && (
            <p className="mt-2 text-sm text-slate-300 bg-slate-700/30 px-3 py-1 rounded-md italic">{data.note}</p>
          )}
        </div>

        {/* Right side - Amount and Actions */}
        <div className="flex items-center space-x-4 ml-4">
          <div className="text-right">
            <p className="text-lg font-bold text-white">₹ {data.amount.toLocaleString()}</p>
            <p className="text-xs text-slate-400 capitalize">{data.section.toLowerCase()}</p>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
              onClick={() =>
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
                })
              }
              title="Edit transaction"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              onClick={() => handleDelete(data.id)}
              title="Delete transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
