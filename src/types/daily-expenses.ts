export type Section = 'expense' | 'income' | 'investment' | 'lend' | 'split';

export type Category = {
  id: number;
  value: string;
  emoji: number;
};

export type CreateCategory = {
  value: string;
  emoji: number;
};

export type UpdateCategory = {
  id: number;
  value: string;
  emoji: number;
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
  amount: number;
  category: Category;
  account: Account;
};

export type CreateTransaction = {
  date: string;
  amount: number;
  category: number;
  account: number;
};

export type UpdateTransaction = {
  id: number;
  date: string;
  amount: number;
  category: number;
  account: number;
};

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
}

export type TransactionGroupByDate = {
  date: string;
  summary: TransactionSummary;
  data: Transaction[];
};
