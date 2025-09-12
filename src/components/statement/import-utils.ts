import { Account, Category, Transaction } from '../../sqlite';
import {
  Account as AccountType,
  Category as CategoryType,
  CreateAccount,
  CreateCategory,
  PersonalFinanceSection,
} from '../../types';

type ParsedTransaction = {
  date: string;
  section: string;
  credit: boolean;
  amount: number;
  category: {
    emoji: string;
    name: string;
  };
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
      const [day, month, year] = parts[0].split('/');
      const [emoji, catname] = parts[4].split(':');
      return {
        date: `${year}-${month}-${day}`,
        section: parts[1],
        credit: parts[2] === 'true',
        amount: Number(parts[3]),
        category: {
          name: catname,
          emoji,
        },
        account: parts[5],
        note: parts.slice(6).join(','),
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
    requiredCategories.add(`${each.category.emoji}:${each.category.name}:${each.section}`);
  });

  const reqAccounts: CreateAccount[] = Array.from(requiredAccounts).map((name: string) => ({ name }));
  const accounts = Account.bulk(reqAccounts);

  const reqCategories: CreateCategory[] = Array.from(requiredCategories).map((each: string) => {
    const [emoji, name, section] = each.split(':');
    return { name, emoji, section: section as PersonalFinanceSection };
  });
  const categories = Category.bulk(reqCategories);

  const accountIdMap: Record<string, number> = {};
  accounts.forEach((each: AccountType) => {
    accountIdMap[each.name] = each.id;
  });

  const categoryIdMap: Record<string, number> = {};
  categories.forEach((each: CategoryType) => {
    categoryIdMap[each.name] = each.id;
  });

  Transaction.bulk(
    transactions.map((each) => ({
      ...each,
      account_id: accountIdMap[each.account],
      category_id: categoryIdMap[each.category.name],
    }))
  );
};
