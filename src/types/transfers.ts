export type CreateTransfer = {
  date: string;
  amount: number;
  from_account_id: number;
  to_account_id: number;
  note?: string;
};

export type UpdateTransfer = {
  id: number;
  date?: string;
  amount?: number;
  from_account_id?: number;
  to_account_id?: number;
  note?: string;
};
