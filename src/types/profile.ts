import { Account } from '.';

export type Profile = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  default_account_id?: number;
  default_account?: Account;
  is_self: boolean;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
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
