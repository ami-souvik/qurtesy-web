import { useEffect, useState } from 'react';
import { Table } from './ui';
import { Transaction } from '../types';
import axios from 'axios';

export function DailyExpenses() {
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    getTransactions();
    axios
      .get('http://localhost:8000/categories')
      .then((resp) => {
        setCategories(
          resp.data.map((v) => ({
            label: v.value,
            value: v.id,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('http://localhost:8000/accounts')
      .then((resp) => {
        setAccounts(
          resp.data.map((v) => ({
            label: v.value,
            value: v.id,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const getTransactions = () => {
    axios
      .get('http://localhost:8000/transactions')
      .then((resp) => {
        setTransactions(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createTransaction = ({ date, amount, category, account }) => {
    axios
      .post('http://localhost:8000/transactions', {
        date,
        amount: Number(amount),
        category: Number(category),
        account: Number(account),
      })
      .then(() => {
        getTransactions();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteTransaction = (id) => {
    axios
      .delete(`http://localhost:8000/transactions/${id}`)
      .then(() => {
        getTransactions();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h3>Daily Expenses</h3>
      <Table
        columnMeta={[
          {
            label: 'Date',
            key: 'date',
            type: 'date',
            placeholder: 'yyyy-mm-dd',
          },
          {
            label: 'Amount',
            key: 'amount',
            type: 'numeric',
            defaultValue: 0,
          },
          {
            label: 'Category',
            key: 'category',
            type: 'picker',
            values: categories,
          },
          {
            label: 'Account',
            key: 'account',
            type: 'picker',
            values: accounts,
          },
        ]}
        values={transactions}
        handleSubmit={createTransaction}
        handleDelete={deleteTransaction}
      />
    </div>
  );
}
