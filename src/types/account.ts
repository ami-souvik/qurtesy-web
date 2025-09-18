export type Account = {
  id: number;
  name: string;
  balance?: number;
  calculated_balance?: number;
  balance_difference?: number;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  sync_status: 'pending' | 'synced';
};

export type CreateAccount = {
  name: string;
  balance?: number;
};

export type UpdateAccount = {
  id: number;
  name?: string;
  balance?: number;
};
