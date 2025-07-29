import { BaseInstance } from './http-client';
import { Budget, CreateBudget, UpdateBudget } from '../types';

export const getBudgets = async (month?: number, year?: number, categoryId?: number): Promise<Budget[]> => {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  if (categoryId) params.append('category_id', categoryId.toString());

  const response = await BaseInstance.httpClient._get('/budgets/', { params });
  return response.data;
};

export const getBudget = async (budgetId: number): Promise<Budget> => {
  const response = await BaseInstance.httpClient._get(`/budgets/${budgetId}`);
  return response.data;
};

export const createBudget = async (budget: CreateBudget): Promise<{ id: number; message: string }> => {
  const response = await BaseInstance.httpClient._post('/budgets/', budget);
  return response.data;
};

export const updateBudget = async (budgetId: number, budgetData: UpdateBudget): Promise<{ message: string }> => {
  const response = await BaseInstance.httpClient._put(`/budgets/${budgetId}`, budgetData);
  return response.data;
};

export const deleteBudget = async (budgetId: number): Promise<{ message: string }> => {
  const response = await BaseInstance.httpClient._del(`/budgets/${budgetId}`);
  return response.data;
};

export const getBudgetSummary = async (
  year: number,
  month: number
): Promise<{
  year: number;
  month: number;
  total_budgeted: number;
  total_spent: number;
  remaining_budget: number;
  percentage_used: number;
  budgets: Budget[];
}> => {
  const response = await BaseInstance.httpClient._get(`/budgets/summary/${year}/${month}`);
  return response.data;
};

export const refreshBudgetSpentAmounts = async (): Promise<{
  message: string;
  updated_count: number;
}> => {
  const response = await BaseInstance.httpClient._post('/budgets/refresh-spent-amounts', {});
  return response.data;
};
