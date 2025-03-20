import { useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from './types';
import { Table } from './components/ui';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    axios
      .get('http://localhost:8000/transactions')
      .then((resp) => {
        console.log(resp.data);
        setTransactions(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="w-full h-[100vh] grid grid-cols-4 grid-rows-2 gap-4">
      <div>
        <p>total balance</p>
        <p>20,000/-</p>
        <div className="flex gap-4">
          <div className="border-r">
            <p>income</p>
            <p>40,000/-</p>
          </div>
          <div className="border-r">
            <p>expenses</p>
            <p>20,000/-</p>
          </div>
          <div>
            <p>total</p>
            <p>20,000/-</p>
          </div>
        </div>
      </div>
      <div></div>
      <div>
        <h3>Daily Expenses</h3>
        <Table
          columnMeta={[
            {
              label: 'Date',
              key: 'date',
              placeholder: 'yyyy-mm-dd',
            },
            {
              label: 'Amount',
              key: 'amount',
              defaultValue: 0,
            },
            {
              label: 'Category',
              key: 'category',
            },
            {
              label: 'Account',
              key: 'account',
            },
          ]}
          values={transactions}
        />
      </div>
      <div>
        <h3>Investments</h3>
        <Table
          columnMeta={[
            {
              label: 'Date',
              key: 'date',
              placeholder: 'yyyy-mm-dd',
            },
            {
              label: 'Amount',
              key: 'amount',
              defaultValue: 0,
            },
            {
              label: 'Category',
              key: 'category',
            },
            {
              label: 'Account',
              key: 'account',
            },
          ]}
          values={transactions}
        />
      </div>
      <div></div>
      <div></div>
      <div>
        <h3>Lend</h3>
        <Table
          columnMeta={[
            {
              label: 'Date',
              key: 'date',
              placeholder: 'yyyy-mm-dd',
            },
            {
              label: 'Amount',
              key: 'amount',
              defaultValue: 0,
            },
            {
              label: 'Category',
              key: 'category',
            },
            {
              label: 'Account',
              key: 'account',
            },
          ]}
          values={transactions}
        />
      </div>
      <div>
        <h3>Group/Share Expense</h3>
        <Table
          columnMeta={[
            {
              label: 'Date',
              key: 'date',
              placeholder: 'yyyy-mm-dd',
            },
            {
              label: 'Amount',
              key: 'amount',
              defaultValue: 0,
            },
            {
              label: 'Category',
              key: 'category',
            },
            {
              label: 'Account',
              key: 'account',
            },
          ]}
          values={transactions}
        />
      </div>
    </div>
  );
}

export default App;
