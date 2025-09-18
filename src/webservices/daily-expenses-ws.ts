import {
  TransactionType,
  CreateTransaction,
  CreateSplitTransaction,
  UpdateSplitTransaction,
  SplitTransaction,
  Profile,
  CreateProfile,
  UpdateProfile,
  LendTransaction,
  CreateLendTransaction,
  UpdateLendTransaction,
  LendRepaymentUpdate,
  LendSummary,
} from '../types';
import { BaseInstance } from './http-client';

// New API functions for enhanced features
export const getSpendingByCategory = async (yearmonth: string, section: TransactionType = TransactionType.expense) => {
  return BaseInstance.httpClient
    ._get('/transactions/analytics/spending-by-category', {
      params: { yearmonth, section },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const getSpendingTrends = async (months: number = 6) => {
  return BaseInstance.httpClient
    ._get('/transactions/analytics/trends', {
      params: { months },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return { trends: {} };
    });
};

export const bulkCreateTransactions = async (transactions: CreateTransaction[]) => {
  return BaseInstance.httpClient
    ._post('/transactions/bulk', transactions)
    .then((resp) => resp.data)
    .catch((err) => {
      throw err;
    });
};

// Split Transaction APIs
export const getSplitTransactions = async (): Promise<SplitTransaction[]> => {
  return BaseInstance.httpClient
    ._get('/splits/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const createSplitTransaction = async (
  data: CreateSplitTransaction
): Promise<{ message: string; split_transaction_id: number; share_amount: number }> => {
  return BaseInstance.httpClient
    ._post('/splits/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateSplitTransaction = async (
  id: number,
  data: UpdateSplitTransaction
): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._put(`/splits/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const deleteSplitTransaction = async (id: number): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._del(`/splits/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateParticipantPaymentStatus = async (
  splitId: number,
  participantId: number,
  isPaid: boolean
): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._patch(`/splits/${splitId}/participants/${participantId}`, { is_paid: isPaid })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// Profile APIs
export const getProfiles = async (): Promise<Profile[]> => {
  return BaseInstance.httpClient
    ._get('/profiles/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const createProfile = async (data: CreateProfile): Promise<{ message: string; profile_id: number }> => {
  return BaseInstance.httpClient
    ._post('/profiles/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateProfile = async (id: number, data: UpdateProfile): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._put(`/profiles/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const deleteProfile = async (id: number): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._del(`/profiles/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// Lend Transaction APIs
export const getLendTransactions = async (status?: 'pending' | 'repaid'): Promise<LendTransaction[]> => {
  const params = status ? { status } : {};
  return BaseInstance.httpClient
    ._get('/lends/', { params })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const createLendTransaction = async (
  data: CreateLendTransaction
): Promise<{ message: string; lend_transaction_id: number; amount: number; borrower: string }> => {
  return BaseInstance.httpClient
    ._post('/lends/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getLendTransaction = async (id: number): Promise<LendTransaction> => {
  return BaseInstance.httpClient
    ._get(`/lends/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateLendTransaction = async (id: number, data: UpdateLendTransaction): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._put(`/lends/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateLendRepaymentStatus = async (
  id: number,
  data: LendRepaymentUpdate
): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._patch(`/lends/${id}/repayment`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const deleteLendTransaction = async (id: number): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._del(`/lends/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getLendSummary = async (): Promise<LendSummary> => {
  return BaseInstance.httpClient
    ._get('/lends/summary/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return {
        total_lent: 0,
        total_pending: 0,
        total_repaid: 0,
        pending_count: 0,
        repaid_count: 0,
      };
    });
};
