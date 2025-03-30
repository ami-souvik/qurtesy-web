export type Section = 'EXPENSE' | 'INCOME' | 'TRANSFER' | 'INVESTMENT' | 'LEND' | 'SPLIT';

export type CategoryGroup = {
  id: number;
  value: string;
  emoji?: number;
  section: Section;
  categories: Category[];
};

export type Category = {
  id: number;
  value: string;
  emoji?: number;
};

export type CreateCategory = {
  value: string;
  emoji?: number;
};

export type UpdateCategory = {
  id: number;
  value?: string;
  emoji?: number;
};

export type AccountGroup = {
  id: number;
  value: string;
  accounts: Category[];
};

export type Account = {
  id: number;
  value: string;
};

export type CreateAccount = {
  value: string;
};

export type UpdateAccount = {
  id: number;
  value: string;
};

export type Transaction = {
  id: number;
  date: string;
  credit: boolean;
  amount: number;
  category_group: Category;
  category: Category;
  account_group: AccountGroup;
  account: Account;
  note: string;
};

export type CreateTransaction = {
  date: string;
  amount: number;
  category_group: number;
  category: number;
  account_group: number;
  account: number;
  note?: string;
};

export type UpdateTransaction = {
  id: number;
  date?: string;
  amount?: number;
  category?: number;
  account?: number;
};

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
}

export type TransactionGroupByDate = {
  date: string;
  total: number;
  data: Transaction[];
};
