import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index.types';
import { exportToCSV, exportBudgetsToCSV, exportToPDF, ExportData } from './export-utils';
import { FileText, FileSpreadsheet, Calendar, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export const ExportManager: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'transactions' | 'budgets' | 'report'>('transactions');

  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const budgets = useSelector((state: RootState) => state.transactions.budgets);
  const categories = useSelector((state: RootState) => state.transactions.categories);
  const accounts = useSelector((state: RootState) => state.transactions.accounts);
  const summary = useSelector((state: RootState) => state.transactions.summary);
  const [year, month] = useSelector((state: RootState) => state.transactions.yearmonth);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      const monthName = format(new Date(year, month), 'MMMM-yyyy');

      if (exportType === 'transactions') {
        exportToCSV(transactions, `transactions-${monthName}-${timestamp}`);
      } else if (exportType === 'budgets') {
        exportBudgetsToCSV(budgets, `budgets-${monthName}-${timestamp}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      const monthName = format(new Date(year, month), 'MMMM-yyyy');
      const monthStart = startOfMonth(new Date(year, month));
      const monthEnd = endOfMonth(new Date(year, month));

      const exportData: ExportData = {
        transactions,
        budgets,
        categories,
        accounts,
        dateRange: {
          start: format(monthStart, 'dd/MM/yyyy'),
          end: format(monthEnd, 'dd/MM/yyyy'),
        },
        summary: {
          totalIncome: transactions.filter((t) => t.section === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
          totalExpense: transactions.filter((t) => t.section === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0),
          netBalance: summary.balance,
          totalBudgeted: budgets.reduce((sum, b) => sum + b.budgeted_amount, 0),
          totalSpent: budgets.reduce((sum, b) => sum + b.spent_amount, 0),
        },
      };

      await exportToPDF(exportData, `financial-report-${monthName}-${timestamp}`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="space-y-4">
        {/* Export Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Export Type</label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as 'transactions' | 'budgets' | 'report')}
            className="w-full glass-input rounded-lg px-3 py-2 text-white content-('_↗') after:content-['_↗']"
          >
            <option value="transactions">Transactions</option>
            <option value="budgets">Budgets</option>
            <option value="report">Full Report</option>
          </select>
        </div>

        {/* Current Period Info */}
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <Calendar className="h-4 w-4" />
          <span>Exporting data for {format(new Date(year, month), 'MMMM yyyy')}</span>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="glass-button px-4 py-3 rounded-lg text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center justify-center space-x-2">
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              <span>Export CSV</span>
            </div>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting || exportType === 'transactions'}
            className="glass-button px-4 py-3 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center justify-center space-x-2">
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              <span>Export PDF</span>
            </div>
          </button>
        </div>

        {/* Info Text */}
        <div className="text-xs text-slate-500 space-y-1">
          <p>• CSV exports include all transaction/budget details</p>
          <p>• PDF reports include summary and budget overview</p>
          <p>• Files are downloaded to your default download folder</p>
        </div>
      </div>
    </div>
  );
};
