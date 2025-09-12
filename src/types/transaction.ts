export type Transaction = {
  id: number;
  type: 'expense' | 'income' | 'transfer' | 'lending' | 'split';
  amount: number;
  category_id?: number;
  account_id: number;
  note?: string;
  date: Date;
  transfer_account_id?: number;
  counterparty?: string;
  recurring_rule?: string;
  parent_id?: number;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  sync_status: 'synced' | 'pending';
};

export type CreateTransaction = {
  type: 'expense' | 'income' | 'transfer' | 'lending' | 'split';
  amount: number;
  category_id?: number;
  account_id: number;
  note?: string;
  date?: Date;
  transfer_account_id?: number;
  counterparty?: string;
  recurring_rule?: string;
  parent_id?: number;
};

export type UpdateTransaction = {
  id: number;
  type: 'expense' | 'income' | 'transfer' | 'lending' | 'split';
  amount: number;
  category_id?: number;
  account_id: number;
  note?: string;
  date: Date;
  transfer_account_id?: number;
  counterparty?: string;
  recurring_rule?: string;
  parent_id?: number;
};

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
  investment?: number;
  net_worth?: number;
}

export type TransactionGroupByDate = {
  date: string;
  total: number;
  data: Transaction[];
};
