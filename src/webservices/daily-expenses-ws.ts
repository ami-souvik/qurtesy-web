import axios from 'axios';

export const getTransactions = async (yearmonth?: string) => {
  return await axios
    .get('http://localhost:8000/transactions', {
      params: { yearmonth },
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const postTransaction = async ({ date, amount, category, account }) => {
  return await axios
    .post('http://localhost:8000/transactions', {
      date,
      amount: Number(amount),
      category: Number(category),
      account: Number(account),
    })
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const getCategories = async () => {
  return await axios
    .get('http://localhost:8000/categories')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export const getAccounts = async () => {
  return await axios
    .get('http://localhost:8000/accounts')
    .then((resp) => resp.data)
    .catch((err) => {
      console.log(err);
      return [];
    });
};
