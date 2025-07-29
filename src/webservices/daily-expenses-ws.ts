import {
  PersonalFinanceSection,
  Transaction,
  CreateTransaction,
  Category,
  CreateCategory,
  Account,
  CreateAccount,
  TransactionSummary,
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
} from '../types/daily-expenses';
import { BaseInstance } from './http-client';

/* eslint-disable @typescript-eslint/no-unused-vars */

export const getTransactions =
  (section?: PersonalFinanceSection) =>
  async (year: number, month: number): Promise<Transaction[]> => {
    const yearmonth = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    return BaseInstance.httpClient
      ._get('/api/transactions/', {
        params: { section, yearmonth },
      })
      .then((resp) => {
        // Handle the new API response structure with pagination
        if (resp.data.transactions) {
          return resp.data.transactions;
        }
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

export const postTransaction =
  (section: PersonalFinanceSection) =>
  async (data: CreateTransaction): Promise<Transaction | null> => {
    return BaseInstance.httpClient
      ._post('/api/transactions/', data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putTransaction =
  (_section: PersonalFinanceSection) =>
  async (id: number, data: Partial<CreateTransaction>): Promise<Transaction | null> => {
    return BaseInstance.httpClient
      ._put(`/api/transactions/${id}`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteTransaction = (_section: PersonalFinanceSection) => async (id: number) => {
  return BaseInstance.httpClient._del(`/api/transactions/${id}`);
};

export const getTransactionsSummary = (_section: PersonalFinanceSection) => async (): Promise<TransactionSummary> => {
  return BaseInstance.httpClient
    ._get('/api/transactions/summary')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return {
        balance: 0,
        expense: 0,
        income: 0,
        investment: 0,
        net_worth: 0,
      };
    });
};

export const getCategories = () => async (): Promise<Category[]> => {
  return BaseInstance.httpClient
    ._get('/api/categories/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const postCategory =
  (section: PersonalFinanceSection) =>
  async (data: CreateCategory): Promise<Category | null> => {
    return BaseInstance.httpClient
      ._post('/api/categories/', data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putCategory =
  (_section: PersonalFinanceSection) =>
  async (id: number, data: Partial<CreateCategory>): Promise<Category | null> => {
    return BaseInstance.httpClient
      ._put(`/api/categories/${id}`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteCategory = (_section: PersonalFinanceSection) => async (id: number) => {
  return BaseInstance.httpClient._del(`/api/categories/${id}`);
};

export const bulkCreateCatergories = async (categories: CreateCategory[]) => {
  return BaseInstance.httpClient
    ._post('/api/categories/bulk', categories)
    .then((resp) => resp.data)
    .catch((err) => {
      throw err;
    });
};

export const getAccounts = (_section: PersonalFinanceSection) => async (): Promise<Account[]> => {
  return BaseInstance.httpClient
    ._get('/api/accounts/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const postAccount =
  (_section: PersonalFinanceSection) =>
  async (data: CreateAccount): Promise<Account | null> => {
    return BaseInstance.httpClient
      ._post('/api/accounts/', data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putAccount =
  (_section: PersonalFinanceSection) =>
  async (id: number, data: Partial<CreateAccount>): Promise<Account | null> => {
    return BaseInstance.httpClient
      ._put(`/api/accounts/${id}`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const updateAccountBalance = async (id: number, balance: number): Promise<Account | null> => {
  return BaseInstance.httpClient
    ._patch(`/api/accounts/${id}/balance`, { balance })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const deleteAccount = (_section: PersonalFinanceSection) => async (id: number) => {
  return BaseInstance.httpClient._del(`/api/accounts/${id}`);
};

export const bulkCreateAccounts = async (accounts: CreateAccount[]) => {
  return BaseInstance.httpClient
    ._post('/api/accounts/bulk', accounts)
    .then((resp) => resp.data)
    .catch((err) => {
      throw err;
    });
};

// New API functions for enhanced features
export const getSpendingByCategory = async (yearmonth: string, section: PersonalFinanceSection = 'EXPENSE') => {
  return BaseInstance.httpClient
    ._get('/api/transactions/analytics/spending-by-category', {
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
    ._get('/api/transactions/analytics/trends', {
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
    ._post('/api/transactions/bulk', transactions)
    .then((resp) => resp.data)
    .catch((err) => {
      throw err;
    });
};

// Split Transaction APIs
export const getSplitTransactions = async (): Promise<SplitTransaction[]> => {
  return BaseInstance.httpClient
    ._get('/api/splits/')
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
    ._post('/api/splits/', data)
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
    ._put(`/api/splits/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const deleteSplitTransaction = async (id: number): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._del(`/api/splits/${id}`)
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
    ._patch(`/api/splits/${splitId}/participants/${participantId}`, { is_paid: isPaid })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// Profile APIs
export const getProfiles = async (): Promise<Profile[]> => {
  return BaseInstance.httpClient
    ._get('/api/profiles/')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const createProfile = async (data: CreateProfile): Promise<{ message: string; profile_id: number }> => {
  return BaseInstance.httpClient
    ._post('/api/profiles/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateProfile = async (id: number, data: UpdateProfile): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._put(`/api/profiles/${id}`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const deleteProfile = async (id: number): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._del(`/api/profiles/${id}`)
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
    ._get('/api/lends/', { params })
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
    ._post('/api/lends/', data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getLendTransaction = async (id: number): Promise<LendTransaction> => {
  return BaseInstance.httpClient
    ._get(`/api/lends/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const updateLendTransaction = async (id: number, data: UpdateLendTransaction): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._put(`/api/lends/${id}`, data)
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
    ._patch(`/api/lends/${id}/repayment`, data)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const deleteLendTransaction = async (id: number): Promise<{ message: string }> => {
  return BaseInstance.httpClient
    ._del(`/api/lends/${id}`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getLendSummary = async (): Promise<LendSummary> => {
  return BaseInstance.httpClient
    ._get('/api/lends/summary/')
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
