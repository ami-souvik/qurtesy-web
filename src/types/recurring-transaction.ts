import { PersonalFinanceSection, Account, Category } from '.';

export type RecurringTransaction = {
  id: number;
  name: string;
  amount: number;
  section: PersonalFinanceSection;
  category?: Category;
  account?: Account;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_execution: string;
  is_active: boolean;
  note?: string;
  deleted: boolean;
};

export type CreateRecurringTransaction = {
  name: string;
  amount: number;
  category_id?: number;
  account_id?: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  note?: string;
};

export type UpdateRecurringTransaction = {
  name?: string;
  amount?: number;
  category_id?: number;
  account_id?: number;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  end_date?: string;
  is_active?: boolean;
  note?: string;
};
