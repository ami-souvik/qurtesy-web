import { Account, Category, CreateAccount, CreateCategory } from '../../types';
import { bulkCreateAccounts, bulkCreateCatergories, bulkCreateTransactions } from '../../webservices/daily-expenses-ws';

type ParsedTransaction = {
  date: string;
  section: string;
  credit: boolean;
  amount: number;
  category: string;
  account: string;
  note: string;
};

export type StatementSummaryType = {
  transactions: ParsedTransaction[];
  totalTransactions: number;
  totalAmount: number;
  dateRange: string;
  requiredCategories: number;
};

export const parseCSV = (text: string): StatementSummaryType => {
  let totalAmount = 0;
  const dateRange = '';
  const requiredCategories = 0;
  const transactions: ParsedTransaction[] = text
    .split('\n')
    .slice(1)
    .map((each) => {
      const parts = each.split(',');
      totalAmount += (parts[2] === 'true' ? 1 : -1) * Number(parts[3]);
      return {
        date: parts[0],
        section: parts[1],
        credit: parts[2] === 'true',
        amount: Number(parts[3]),
        category: parts[4],
        account: parts[5],
        note: parts[6],
      };
    });
  return {
    transactions,
    totalTransactions: transactions.length,
    totalAmount: totalAmount,
    dateRange,
    requiredCategories,
  };
};

export const importCSV = async (transactions: ParsedTransaction[]) => {
  const requiredAccounts = new Set<string>();
  const requiredCategories = new Set<string>();
  transactions.forEach((each: ParsedTransaction) => {
    requiredAccounts.add(each.account);
    requiredCategories.add(`${each.category}:${each.section}`);
  });
  const reqAccounts: CreateAccount[] = Array.from(requiredAccounts).map((each: string) => ({
    value: each,
  }));
  const { accounts } = await bulkCreateAccounts(reqAccounts);
  const reqCategories: CreateCategory[] = Array.from(requiredCategories).map((each: string) => {
    const [emoji, value, section] = each.split(':');
    return { emoji, value, section };
  });
  const { categories } = await bulkCreateCatergories(reqCategories);
  const accountIdMap: Record<string, number> = {};
  accounts.forEach((each: Account) => {
    accountIdMap[each.value] = each.id;
  });
  const categoryIdMap: Record<string, number> = {};
  categories.forEach((each: Category) => {
    categoryIdMap[`${each.emoji}:${each.value}`] = each.id;
  });
  bulkCreateTransactions(
    transactions.map((each) => ({
      ...each,
      account_id: accountIdMap[each.account],
      category_id: categoryIdMap[each.category],
    }))
  );
};
