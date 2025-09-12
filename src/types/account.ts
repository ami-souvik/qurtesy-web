export type Account = {
  id: number;
  name: string;
  balance?: number;
  calculated_balance?: number;
  balance_difference?: number;
  deleted: boolean;
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
