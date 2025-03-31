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
  CategoryGroup,
  AccountGroup,
} from '../types/daily-expenses';

export const getTransactions =
  (section: Section) =>
  async (year: number, month: number): Promise<Transaction[]> => {
    const yearmonth = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    return axios
      .get(`${BASE_URL}/transactions`, {
        params: { section, yearmonth },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

export const postTransaction =
  (section: Section) =>
  async (data: CreateTransaction): Promise<Transaction | null> => {
    return axios
      .post(`${BASE_URL}/transactions`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putTransaction =
  (section: Section) =>
  async (id: number, data: CreateTransaction): Promise<Transaction | null> => {
    return axios
      .put(`${BASE_URL}/transactions/${id}`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteTransaction = (section: Section) => async (id: number) => {
  return axios.delete(`${BASE_URL}/transactions/${id}`, {
    params: { section },
  });
};

export const getTransactionsSummary = (section: Section) => async (): Promise<TransactionSummary> => {
  return axios
    .get(`${BASE_URL}/transactions/summary`, {
      params: { section },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return {
        balance: 0,
      };
    });
};

export const getCategories = (section: Section) => async (): Promise<CategoryGroup[]> => {
  return axios
    .get(`${BASE_URL}/category_groups`, {
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
      .post(`${BASE_URL}/categories`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putCategory =
  (section: Section) =>
  async (id: number, data: CreateCategory): Promise<Category | null> => {
    return axios
      .put(`${BASE_URL}/categories/${id}`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteCategory = (section: Section) => async (id: number) => {
  return axios.delete(`${BASE_URL}/categories/${id}`, {
    params: { section },
  });
};

export const getAccounts = (section: Section) => async (): Promise<AccountGroup[]> => {
  return axios
    .get(`${BASE_URL}/account_groups`, {
      params: { section },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const postAccount =
  (section: Section) =>
  async (data: CreateAccount): Promise<Account | null> => {
    return axios
      .post(`${BASE_URL}/accounts`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const putAccount =
  (section: Section) =>
  async (id: number, data: CreateAccount): Promise<Account | null> => {
    return axios
      .put(`${BASE_URL}/accounts/${id}`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteAccount = (section: Section) => async (id: number) => {
  return axios.delete(`${BASE_URL}/accounts/${id}`, {
    params: { section },
  });
};
