import { Category } from '.';

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
  deleted: boolean;
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
