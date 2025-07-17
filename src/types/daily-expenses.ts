export type TransactionSection = 'TRANSACTION' | 'LEND' | 'SPLIT';
export type PersonalFinanceSection = 'EXPENSE' | 'INCOME' | 'TRANSFER' | 'INVESTMENT';

export type Category = {
  id: number;
  value: string;
  emoji?: string;
  section?: PersonalFinanceSection;
};

export type CreateCategory = {
  value: string;
  emoji?: string;
};

export type UpdateCategory = {
  id: number;
  value?: string;
  emoji?: string;
};

export type Account = {
  id: number;
  value: string;
  balance?: number;
  calculated_balance?: number;
  balance_difference?: number;
};

export type CreateAccount = {
  value: string;
  balance?: number;
};

export type UpdateAccount = {
  id: number;
  value?: string;
  balance?: number;
};

export type Transaction = {
  id: number;
  date: string;
  credit: boolean;
  amount: number;
  section: PersonalFinanceSection;
  category?: Category;
  account?: Account;
  note?: string;
};

export type CreateTransaction = {
  date: string;
  amount: number;
  category_id?: number;
  account_id?: number;
  note?: string;
};

export type UpdateTransaction = {
  id: number;
  date?: string;
  amount?: number;
  category_id?: number;
  account_id?: number;
  note?: string;
};

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
  investment?: number;
  net_worth?: number;
}

export type TransactionGroupByDate = {
  date: string;
  total: number;
  data: Transaction[];
};

export type Budget = {
  id: number;
  category: Category;
  month: number;
  year: number;
  budgeted_amount: number;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  is_over_budget: boolean;
};

export type CreateBudget = {
  category_id: number;
  month: number;
  year: number;
  budgeted_amount: number;
};

export type UpdateBudget = {
  budgeted_amount?: number;
};

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

export type Profile = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  default_account?: Account;
  is_self: boolean;
};

export type CreateProfile = {
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  default_account_id?: number;
  is_self?: boolean;
};

export type UpdateProfile = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  default_account_id?: number;
};

export type UpdateProfileData = {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  default_account_id?: number;
};

export type SplitParticipant = {
  id?: number;
  profile: Profile;
  share_amount: number;
  is_paid: boolean;
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
