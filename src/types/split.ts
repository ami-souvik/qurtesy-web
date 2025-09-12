import { Account, Category, Profile } from '.';

export type SplitParticipant = {
  id?: number;
  profile: Profile;
  share_amount: number;
  is_paid: boolean;
  deleted: boolean;
};

export type SplitTransaction = {
  id: number;
  name: string;
  total_amount: number;
  date: string;
  category?: Category;
  created_by_account: Account;
  participants: SplitParticipant[];
  note?: string;
  total_paid: number;
  total_pending: number;
  is_settled: boolean;
  deleted: boolean;
};

export type CreateSplitParticipant = {
  profile_id: number;
};

export type CreateSplitTransaction = {
  name: string;
  total_amount: number;
  date: string;
  category_id?: number;
  created_by_account_id: number;
  participants: CreateSplitParticipant[];
  note?: string;
};

export type UpdateSplitTransaction = {
  name?: string;
  total_amount?: number;
  date?: string;
  category_id?: number;
  note?: string;
};
