import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from './ui';
import { fetchTransactions, createTransaction, fetchCategories, fetchAccounts } from '../slices/daily-expenses-slice';

export function DailyExpenses() {
  const dispatch = useDispatch();
  const { categories, accounts, transactions } = useSelector((state) => state.dailyExpense);
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    dispatch(fetchAccounts());
  }, []);
  const deleteTransaction = (id) => {
    axios
      .delete(`http://localhost:8000/transactions/${id}`)
      .then(() => {
        dispatch(fetchTransactions());
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
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
            values: categories.map((v) => ({
              label: v.value,
              value: v.id,
            })),
          },
          {
            label: 'Account',
            key: 'account',
            type: 'picker',
            values: accounts.map((v) => ({
              label: v.value,
              value: v.id,
            })),
          },
        ]}
        values={transactions}
        handleSubmit={(v) => dispatch(createTransaction(v))}
        handleDelete={deleteTransaction}
      />
    </div>
  );
}
