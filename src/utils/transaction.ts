import { Transaction, TransactionGroupByDate } from '../types/transaction';

export function groupByDate(transactions: Transaction[]): TransactionGroupByDate[] {
  const grouped: { [key: string]: Transaction[] } = {};

  transactions.forEach((rec) => {
    if (!grouped[rec.date.toISOString()]) {
      grouped[rec.date.toISOString()] = [];
    }
    grouped[rec.date.toISOString()].push(rec);
  });
  return Object.keys(grouped)
    .sort()
    .reverse()
    .map((date) => ({
      date,
      total: grouped[date].reduce((sum, t) => sum + (t.type === 'expense' ? -1 : 1) * t.amount, 0),
      data: grouped[date],
    }));
}
