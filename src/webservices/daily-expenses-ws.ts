import axios from 'axios';
import { BASE_URL } from '../config';
import {
  Section,
  Transaction,
  CreateTransaction,
  Category,
  CreateCategory,
  Account,
  CreateAccount,
  TransactionSummary,
} from '../types/daily-expenses';

/* eslint-disable @typescript-eslint/no-unused-vars */

export const getTransactions =
  (section: Section) =>
  async (year: number, month: number): Promise<Transaction[]> => {
    const yearmonth = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    return axios
      .get(`${BASE_URL}/api/transactions`, {
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
  (section: Section) =>
  async (data: CreateTransaction): Promise<Transaction | null> => {
    return axios
      .post(`${BASE_URL}/api/transactions`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putTransaction =
  (_section: Section) =>
  async (id: number, data: Partial<CreateTransaction>): Promise<Transaction | null> => {
    return axios
      .put(`${BASE_URL}/api/transactions/${id}`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteTransaction = (_section: Section) => async (id: number) => {
  return axios.delete(`${BASE_URL}/api/transactions/${id}`);
};

export const getTransactionsSummary = (_section: Section) => async (): Promise<TransactionSummary> => {
  return axios
    .get(`${BASE_URL}/api/transactions/summary`)
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

export const getCategories = (section: Section) => async (): Promise<Category[]> => {
  return axios
    .get(`${BASE_URL}/api/categories`, {
      params: { section },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const postCategory =
  (section: Section) =>
  async (data: CreateCategory): Promise<Category | null> => {
    return axios
      .post(`${BASE_URL}/api/categories`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putCategory =
  (_section: Section) =>
  async (id: number, data: Partial<CreateCategory>): Promise<Category | null> => {
    return axios
      .put(`${BASE_URL}/api/categories/${id}`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteCategory = (_section: Section) => async (id: number) => {
  return axios.delete(`${BASE_URL}/api/categories/${id}`);
};

export const getAccounts = (_section: Section) => async (): Promise<Account[]> => {
  return axios
    .get(`${BASE_URL}/api/accounts`)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const postAccount =
  (_section: Section) =>
  async (data: CreateAccount): Promise<Account | null> => {
    return axios
      .post(`${BASE_URL}/api/accounts`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putAccount =
  (_section: Section) =>
  async (id: number, data: Partial<CreateAccount>): Promise<Account | null> => {
    return axios
      .put(`${BASE_URL}/api/accounts/${id}`, data)
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const updateAccountBalance = async (id: number, balance: number): Promise<Account | null> => {
  return axios
    .patch(`${BASE_URL}/api/accounts/${id}/balance`, { balance })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const deleteAccount = (_section: Section) => async (id: number) => {
  return axios.delete(`${BASE_URL}/api/accounts/${id}`);
};

// New API functions for enhanced features
export const getSpendingByCategory = async (yearmonth: string, section: Section = 'EXPENSE') => {
  return axios
    .get(`${BASE_URL}/api/transactions/analytics/spending-by-category`, {
      params: { yearmonth, section },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const getSpendingTrends = async (months: number = 6) => {
  return axios
    .get(`${BASE_URL}/api/transactions/analytics/trends`, {
      params: { months },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return { trends: {} };
    });
};

export const bulkCreateTransactions = async (transactions: CreateTransaction[]) => {
  return axios
    .post(`${BASE_URL}/api/transactions/bulk`, transactions)
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
