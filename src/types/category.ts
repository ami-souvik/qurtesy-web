import { SyncStatus } from './common';

export enum CategoryType {
  expense = 'expense',
  income = 'income',
}

export type Category = {
  id: number;
  name: string;
  emoji?: string;
  type: CategoryType;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  sync_status: SyncStatus;
};

export type CreateCategory = {
  name: string;
  emoji?: string;
  type: CategoryType;
};

export type UpdateCategory = {
  id: number;
  name?: string;
  emoji?: string;
  type?: CategoryType;
};
