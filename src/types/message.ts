export type Message = {
  id: number;
  command: string;
  is_agent: boolean;
  transaction_id?: number;
  transaction_type?: 'expense' | 'income' | 'transfer' | 'lending' | 'split';
  transaction_amount: number;
  transaction_date: Date;
  category_name: string;
  account_name: string;
  updated_at: Date;
  deleted: boolean;
};

export type CreateMessage = {
  command: string;
  is_agent: boolean;
  transaction_id?: number;
  transaction_type?: 'expense' | 'income' | 'transfer' | 'lending' | 'split';
  category_id?: number;
  account_id?: number;
};

export type UpdateMessage = {
  id: number;
  command?: string;
  is_agent?: boolean;
  transaction_id?: number;
  transaction_type?: 'expense' | 'income' | 'transfer' | 'lending' | 'split';
};
