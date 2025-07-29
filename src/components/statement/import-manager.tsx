import React, { useRef, useState } from 'react';
import { StatementSummaryType, importCSV, parseCSV } from './import-utils';
import { FileSpreadsheet, Loader2, CloudUpload } from 'lucide-react';
import { Button } from '../action/button';
import { CurrencyDisplay } from '../currency';
import { PageWrapper } from '../layout';

export const ImportManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importType, setImportType] = useState<'transactions' | 'budgets'>('transactions');
  const [statementSummary, setStatementSummary] = useState<StatementSummaryType | null>(null);
  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleParseCSV(await e.target.files[0].text());
    }
  };
  const handleParseCSV = async (text: string) => {
    setIsImporting(true);
    try {
      setStatementSummary(parseCSV(text));
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };
  const handleImportCSV = () => {
    importCSV(statementSummary?.transactions || []);
  };
  const renderSummary = () => {
    const { totalTransactions, totalAmount, dateRange, requiredCategories } = statementSummary!;
    return (
      <div className="glass-card rounded-lg p-4 bg-purple-500/10 border-purple-500/20">
        <h3 className="font-medium text-white mb-2">Statement Summary</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <span className="text-slate-400">Total Transactions:</span>
          <span className="ml-2 text-white text-end font-medium">{totalTransactions}</span>
          <span className="text-slate-400">Total Amount:</span>
          <span className="ml-2 text-white text-end font-medium">
            <CurrencyDisplay amount={totalAmount} showConversion originalCurrency="INR" />
          </span>
          <span className="text-slate-400">Date Range:</span>
          <span className="ml-2 text-white text-end font-medium">{dateRange}</span>
          <span className="text-slate-400">Categories:</span>
          <span className="ml-2 text-white text-end font-medium">{requiredCategories}</span>
        </div>
      </div>
    );
  };
  return (
    <PageWrapper title="Import Data">
      <div className="glass-card rounded-xl p-6">
        <div className="space-y-4">
          {/* Summary */}
          {statementSummary && renderSummary()}
          {/* Import Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Import Type</label>
            <select
              value={importType}
              onChange={(e) => setImportType(e.target.value as 'transactions' | 'budgets')}
              className="w-full glass-input rounded-lg px-3 py-2 text-white content-('_↗') after:content-['_↗']"
            >
              <option value="transactions">Transactions</option>
              <option value="budgets">Budgets</option>
              <option value="report">Full Report</option>
            </select>
          </div>

          {/* Import Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button leftIcon={<CloudUpload className="h-4 w-4 mr-2" />} onClick={handleUpload}>
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
              <span>Upload</span>
            </Button>
            <Button
              className="text-green-400"
              leftIcon={
                isImporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )
              }
              variant="outline"
              onClick={handleImportCSV}
              disabled={isImporting}
            >
              <span>Import CSV</span>
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
