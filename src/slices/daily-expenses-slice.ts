import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTransactions, postTransaction, getCategories, getAccounts } from '../webservices/daily-expenses-ws';

export const fetchTransactions = createAsyncThunk('trasactions/list', getTransactions);

export const createTransaction = createAsyncThunk('transactions/create', async (transactionData, { dispatch }) => {
  await postTransaction(transactionData);
  return dispatch(fetchTransactions()).unwrap(); // Ensures fetchTransactions runs after postTransaction
});

export const fetchCategories = createAsyncThunk('categories/list', getCategories);

export const fetchAccounts = createAsyncThunk('accounts/list', getAccounts);

export const dailyExpenseSlice = createSlice({
  name: 'dailyExpense',
  initialState: {
    categories: [],
    accounts: [],
    transactions: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      state.accounts = action.payload;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {} = dailyExpenseSlice.actions

export default dailyExpenseSlice;
