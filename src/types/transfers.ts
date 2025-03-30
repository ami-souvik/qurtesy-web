export type CreateTransfer = {
  date: string;
  amount: number;
  from_account: number;
  to_account: number;
};

export type UpdateTransfer = {
  id: number;
  date?: string;
  amount?: number;
  from_account?: number;
  to_account?: number;
};
