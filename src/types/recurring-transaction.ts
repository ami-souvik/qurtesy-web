import { TransactionType, Account, Category, SyncStatus } from '.';

export enum Frequency {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export type RecurringTransaction = {
  id: number;
  name: string;
  amount: number;
  type: TransactionType;
  category?: Category;
  account?: Account;
  frequency: Frequency;
  start_date: Date;
  end_date?: Date;
  next_execution: Date;
  is_active: boolean;
  note?: string;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  sync_status: SyncStatus;
};

export type CreateRecurringTransaction = {
  name: string;
  amount: number;
  type: TransactionType;
  category_id: number;
  account_id?: number;
  frequency: Frequency;
  start_date: Date;
  end_date?: Date;
  next_execution?: Date;
  is_active: boolean;
  note?: string;
};

export type UpdateRecurringTransaction = {
  name?: string;
  amount?: number;
  category_id?: number;
  account_id?: number;
  frequency?: Frequency;
  end_date?: Date;
  is_active?: boolean;
  note?: string;
};
