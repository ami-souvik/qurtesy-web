import {
  RecurringTransaction,
  CreateRecurringTransaction,
  UpdateRecurringTransaction,
  TransactionType,
} from '../types';
import { BaseInstance } from './http-client';

export const getRecurringTransactions = async (
  isActive?: boolean,
  section?: TransactionType
): Promise<RecurringTransaction[]> => {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('is_active', isActive.toString());
  if (section) params.append('section', section);

  const response = await BaseInstance.httpClient._get(`/recurring-transactions/?${params.toString()}`);
  return response.data;
};

export const getRecurringTransaction = async (recurringId: number): Promise<RecurringTransaction> => {
  const response = await BaseInstance.httpClient._get(`/recurring-transactions/${recurringId}`);
  return response.data;
};

export const createRecurringTransaction = async (
  section: TransactionType,
  recurring: CreateRecurringTransaction
): Promise<{ id: number; message: string }> => {
  const response = await BaseInstance.httpClient._post(`/recurring-transactions/?section=${section}`, recurring);
  return response.data;
};

export const updateRecurringTransaction = async (
  recurringId: number,
  recurringData: UpdateRecurringTransaction
): Promise<{ message: string }> => {
  const response = await BaseInstance.httpClient._put(`/recurring-transactions/${recurringId}`, recurringData);
  return response.data;
};

export const deleteRecurringTransaction = async (recurringId: number): Promise<{ message: string }> => {
  const response = await BaseInstance.httpClient._del(`/recurring-transactions/${recurringId}`);
  return response.data;
};

export const executePendingRecurringTransactions = async (): Promise<{
  message: string;
  executed_count: number;
  errors: Array<{ recurring_id: number; name: string; error: string }>;
}> => {
  const response = await BaseInstance.httpClient._post('/recurring-transactions/execute-pending', {});
  return response.data;
};

export const getRecurringTransactionsDueToday = async (): Promise<
  Array<{
    id: number;
    name: string;
    amount: number;
    section: TransactionType;
    category?: { id: number; value: string; emoji?: string };
    account?: { id: number; value: string };
    frequency: string;
    next_execution: string;
    days_overdue: number;
  }>
> => {
  const response = await BaseInstance.httpClient._get('/recurring-transactions/due-today');
  return response.data;
};
