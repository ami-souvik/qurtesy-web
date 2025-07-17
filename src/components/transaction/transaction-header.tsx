import { Search, Filter, SortDesc, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface TransactionHeaderProps {
  totalTransactions: number;
  totalAmount: number;
  onSearch?: (term: string) => void;
  onSort?: (field: string) => void;
  onFilter?: () => void;
}

export function TransactionHeader({
  totalTransactions,
  totalAmount,
  onSearch,
  onSort,
  onFilter,
}: TransactionHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="mb-4">
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 text-xs">
            <span className="text-slate-400">Total: </span>
            <span className="font-medium text-white">{totalTransactions} transactions</span>
          </div>
          <div className="flex space-x-2 text-xs">
            <span className="text-slate-400">Amount:</span>
            <span className="font-bold text-emerald-400">₹ {totalAmount.toLocaleString()}</span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onFilter}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            title="Filter transactions"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSort?.('date')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            title="Sort transactions"
          >
            <SortDesc className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch?.(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/30 border border-slate-700/30 rounded-lg text-white text-xs placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );
}
