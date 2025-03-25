import { Transaction, TransactionGroupByDate } from '../types/daily-expenses';

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
      total: grouped[date].map((d) => d.amount).reduce((sum: number, d) => (sum += d)),
      data: grouped[date],
    }));
}
