import { Account, Category, Profile } from '.';

export type LendTransaction = {
  id: number;
  amount: number;
  date: string;
  lender_profile: Profile;
  borrower_profile: Profile;
  category?: Category;
  account?: Account;
  note?: string;
  is_repaid: boolean;
  repaid_date?: string;
  related_split_transaction_id?: number;
  related_split_participant_id?: number;
  created_from_split: boolean;
  deleted: boolean;
};

export type CreateLendTransaction = {
  amount: number;
  date: string;
  borrower_profile_id: number;
  category_id?: number;
  account_id?: number;
  note?: string;
};

export type UpdateLendTransaction = {
  amount?: number;
  date?: string;
  borrower_profile_id?: number;
  category_id?: number;
  account_id?: number;
  note?: string;
  is_repaid?: boolean;
  repaid_date?: string;
};

export type LendRepaymentUpdate = {
  is_repaid: boolean;
  repaid_date?: string;
};

export type LendSummary = {
  total_lent: number;
  total_pending: number;
  total_repaid: number;
  pending_count: number;
  repaid_count: number;
};
