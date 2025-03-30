import axios from 'axios';
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
      .get('http://localhost:8000/transactions', {
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
      .post('http://localhost:8000/transactions', data, {
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
      .put(`http://localhost:8000/transactions/${id}`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteTransaction = (section: Section) => async (id: number) => {
  return axios.delete(`http://localhost:8000/transactions/${id}`, {
    params: { section },
  });
};

export const getTransactionsSummary = (section: Section) => async (): Promise<TransactionSummary> => {
  return axios
    .get(`http://localhost:8000/transactions/summary`, {
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
    .get('http://localhost:8000/category_groups', {
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
      .post('http://localhost:8000/categories', data, {
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
      .put(`http://localhost:8000/categories/${id}`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteCategory = (section: Section) => async (id: number) => {
  return axios.delete(`http://localhost:8000/categories/${id}`, {
    params: { section },
  });
};

export const getAccounts = (section: Section) => async (): Promise<AccountGroup[]> => {
  return axios
    .get('http://localhost:8000/account_groups', {
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
      .post('http://localhost:8000/accounts', data, {
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
      .put(`http://localhost:8000/accounts/${id}`, data, {
        params: { section },
      })
      .then((resp) => resp.data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

export const deleteAccount = (section: Section) => async (id: number) => {
  return axios.delete(`http://localhost:8000/accounts/${id}`, {
    params: { section },
  });
};
