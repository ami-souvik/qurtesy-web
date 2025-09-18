export type Expense = {
  id: number;
  type: 'expense';
  amount: number;
  date?: Date;
  category_id: number;
  account_id: number;
  note?: string;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  sync_status: 'synced' | 'pending';
};

export type CreateExpense = {
  amount: number;
  date?: Date;
  category_id: number;
  account_id: number;
  note?: string;
};

export type UpdateExpense = {
  id: number;
  amount?: number;
  category_id?: number;
  account_id?: number;
  note?: string;
  date?: Date;
};
