import { Transaction, TransactionGroupByDate, TransactionSummary } from '../types/daily-expenses';

export function summarizeTransactions(transactions: Transaction[]): TransactionSummary {
  const summary = {
    income: 0,
    expenses: 0,
    total: 0,
  };
  transactions.forEach((rec) => {
    summary.expenses += rec.amount;
  });
  return summary;
}

export function groupByDate(transactions: Transaction[]): TransactionGroupByDate[] {
  const grouped: { [key: string]: Transaction[] } = {};

  transactions.forEach((rec) => {
    if (!grouped[rec.date]) {
      grouped[rec.date] = [];
    }
    grouped[rec.date].push(rec);
  });
  return Object.keys(grouped)
    .sort()
    .map((date) => ({
      date,
      summary: summarizeTransactions(grouped[date]),
      data: grouped[date],
    }));
}
