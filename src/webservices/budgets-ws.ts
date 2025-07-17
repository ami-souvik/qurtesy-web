import axios from 'axios';
import { Budget, CreateBudget, UpdateBudget } from '../types';
import { BASE_URL } from '../config';

export const getBudgets = async (month?: number, year?: number, categoryId?: number): Promise<Budget[]> => {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  if (categoryId) params.append('category_id', categoryId.toString());

  const response = await axios.get(`${BASE_URL}/budgets/?${params.toString()}`);
  return response.data;
};

export const getBudget = async (budgetId: number): Promise<Budget> => {
  const response = await axios.get(`${BASE_URL}/budgets/${budgetId}`);
  return response.data;
};

export const createBudget = async (budget: CreateBudget): Promise<{ id: number; message: string }> => {
  const response = await axios.post(`${BASE_URL}/budgets/`, budget);
  return response.data;
};

export const updateBudget = async (budgetId: number, budgetData: UpdateBudget): Promise<{ message: string }> => {
  const response = await axios.put(`${BASE_URL}/budgets/${budgetId}`, budgetData);
  return response.data;
};

export const deleteBudget = async (budgetId: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${BASE_URL}/budgets/${budgetId}`);
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
  const response = await axios.get(`${BASE_URL}/budgets/summary/${year}/${month}`);
  return response.data;
};

export const refreshBudgetSpentAmounts = async (): Promise<{
  message: string;
  updated_count: number;
}> => {
  const response = await axios.post(`${BASE_URL}/budgets/refresh-spent-amounts`);
  return response.data;
};
