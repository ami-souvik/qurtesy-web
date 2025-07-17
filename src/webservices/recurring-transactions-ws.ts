import axios from 'axios';
import { RecurringTransaction, CreateRecurringTransaction, UpdateRecurringTransaction, Section } from '../types';
import { BASE_URL } from '../config';

export const getRecurringTransactions = async (
  isActive?: boolean,
  section?: Section
): Promise<RecurringTransaction[]> => {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('is_active', isActive.toString());
  if (section) params.append('section', section);

  const response = await axios.get(`${BASE_URL}/recurring-transactions/?${params.toString()}`);
  return response.data;
};

export const getRecurringTransaction = async (recurringId: number): Promise<RecurringTransaction> => {
  const response = await axios.get(`${BASE_URL}/recurring-transactions/${recurringId}`);
  return response.data;
};

export const createRecurringTransaction = async (
  section: Section,
  recurring: CreateRecurringTransaction
): Promise<{ id: number; message: string }> => {
  const response = await axios.post(`${BASE_URL}/recurring-transactions/?section=${section}`, recurring);
  return response.data;
};

export const updateRecurringTransaction = async (
  recurringId: number,
  recurringData: UpdateRecurringTransaction
): Promise<{ message: string }> => {
  const response = await axios.put(`${BASE_URL}/recurring-transactions/${recurringId}`, recurringData);
  return response.data;
};

export const deleteRecurringTransaction = async (recurringId: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${BASE_URL}/recurring-transactions/${recurringId}`);
  return response.data;
};

export const executePendingRecurringTransactions = async (): Promise<{
  message: string;
  executed_count: number;
  errors: Array<{ recurring_id: number; name: string; error: string }>;
}> => {
  const response = await axios.post(`${BASE_URL}/recurring-transactions/execute-pending`);
  return response.data;
};

export const getRecurringTransactionsDueToday = async (): Promise<
  Array<{
    id: number;
    name: string;
    amount: number;
    section: Section;
    category?: { id: number; value: string; emoji?: string };
    account?: { id: number; value: string };
    frequency: string;
    next_execution: string;
    days_overdue: number;
  }>
> => {
  const response = await axios.get(`${BASE_URL}/recurring-transactions/due-today`);
  return response.data;
};
