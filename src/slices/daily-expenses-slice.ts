import { createAsyncThunk, createSlice, PayloadAction, type SliceSelectors } from '@reduxjs/toolkit';
import {
  getTransactions as gtxns,
  postTransaction as ptxn,
  putTransaction as puttxn,
  deleteTransaction as dtxn,
  getTransactionsSummary as gtxnsummary,
  getCategories as gcats,
  postCategory as pcat,
  putCategory as putcat,
  deleteCategory as dcat,
  getAccounts as gaccs,
  postAccount as pacc,
  putAccount as putacc,
  deleteAccount as dacc,
} from '../webservices/daily-expenses-ws';
import { postTransfer } from '../webservices/transfers-ws';
import {
  getBudgets,
  createBudget as createBudgetWS,
  updateBudget as updateBudgetWS,
  deleteBudget as deleteBudgetWS,
} from '../webservices/budgets-ws';
import {
  getRecurringTransactions,
  createRecurringTransaction as createRecurringWS,
  updateRecurringTransaction as updateRecurringWS,
  deleteRecurringTransaction as deleteRecurringWS,
  getRecurringTransactionsDueToday,
} from '../webservices/recurring-transactions-ws';
import {
  Section,
  Transaction,
  CreateTransaction,
  UpdateTransaction,
  CreateCategory,
  UpdateCategory,
  Account,
  CreateAccount,
  UpdateAccount,
  TransactionSummary,
  CreateTransfer,
  Category,
  Budget,
  CreateBudget,
  UpdateBudget,
  RecurringTransaction,
  CreateRecurringTransaction,
  UpdateRecurringTransaction,
} from '../types';
import { RootState } from '../store.types';

export const fetchTransactions = createAsyncThunk<Transaction[], void, { state: RootState }>(
  'transactions/list',
  async (_, { getState }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    const [year, month] = state.dailyExpenses.yearmonth;
    return await gtxns(section)(year, month);
  }
);

export const createTransaction = createAsyncThunk<Transaction[], CreateTransaction, { state: RootState }>(
  'transactions/create',
  async (data: CreateTransaction, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    await ptxn(section)(data);
    return dispatch(fetchTransactions()).unwrap();
  }
);

export const updateTransaction = createAsyncThunk<Transaction[], UpdateTransaction, { state: RootState }>(
  'transactions/update',
  async (data: UpdateTransaction, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    const { id, ...rest } = data;
    await puttxn(section)(id, rest);
    return dispatch(fetchTransactions()).unwrap();
  }
);

export const deleteTransaction = createAsyncThunk<Transaction[], number, { state: RootState }>(
  'transactions/delete',
  async (id: number, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    await dtxn(section)(id);
    return dispatch(fetchTransactions()).unwrap();
  }
);

export const fetchTransactionsSummary = createAsyncThunk<TransactionSummary, void, { state: RootState }>(
  'transactions/summary',
  async (_, { getState }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    return gtxnsummary(section)();
  }
);

export const fetchCategories = createAsyncThunk<Category[], void, { state: RootState }>(
  'categories/list',
  async (_, { getState }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    return gcats(section)();
  }
);

export const createCategory = createAsyncThunk<Category[], CreateCategory, { state: RootState }>(
  'categories/create',
  async (data: CreateCategory, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    await pcat(section)(data);
    return dispatch(fetchCategories()).unwrap();
  }
);

export const updateCategory = createAsyncThunk<Category[], UpdateCategory, { state: RootState }>(
  'categories/update',
  async (data: UpdateCategory, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    const { id, ...rest } = data;
    await putcat(section)(id, rest);
    return dispatch(fetchCategories()).unwrap();
  }
);

export const deleteCategory = createAsyncThunk<Category[], number, { state: RootState }>(
  'categories/delete',
  async (id: number, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    await dcat(section)(id);
    return dispatch(fetchCategories()).unwrap();
  }
);

export const fetchAccounts = createAsyncThunk<Account[], void, { state: RootState }>(
  'accounts/list',
  async (_, { getState }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    return gaccs(section)();
  }
);

export const createAccount = createAsyncThunk<Account[], CreateAccount, { state: RootState }>(
  'accounts/create',
  async (data: CreateAccount, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    await pacc(section)(data);
    return dispatch(fetchAccounts()).unwrap();
  }
);

export const updateAccount = createAsyncThunk<Account[], UpdateAccount, { state: RootState }>(
  'accounts/update',
  async (data: UpdateAccount, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    const { id, ...rest } = data;
    await putacc(section)(id, rest);
    return dispatch(fetchAccounts()).unwrap();
  }
);

export const deleteAccount = createAsyncThunk<Account[], number, { state: RootState }>(
  'accounts/delete',
  async (id: number, { getState, dispatch }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    await dacc(section)(id);
    return dispatch(fetchAccounts()).unwrap();
  }
);

export const createTransfer = createAsyncThunk<Transaction[], CreateTransfer, { state: RootState }>(
  'transfers/create',
  async (data: CreateTransfer, { dispatch }) => {
    await postTransfer(data);
    return dispatch(fetchTransactions()).unwrap();
  }
);

// Budget async thunks
export const fetchBudgets = createAsyncThunk<Budget[], void, { state: RootState }>(
  'budgets/list',
  async (_, { getState }) => {
    const state = getState();
    const [year, month] = state.dailyExpenses.yearmonth;
    return await getBudgets(month + 1, year); // month is 0-indexed, API expects 1-indexed
  }
);

export const createBudget = createAsyncThunk<Budget[], CreateBudget, { state: RootState }>(
  'budgets/create',
  async (data: CreateBudget, { dispatch }) => {
    await createBudgetWS(data);
    return dispatch(fetchBudgets()).unwrap();
  }
);

export const updateBudget = createAsyncThunk<Budget[], { id: number; data: UpdateBudget }, { state: RootState }>(
  'budgets/update',
  async ({ id, data }, { dispatch }) => {
    await updateBudgetWS(id, data);
    return dispatch(fetchBudgets()).unwrap();
  }
);

export const deleteBudget = createAsyncThunk<Budget[], number, { state: RootState }>(
  'budgets/delete',
  async (id: number, { dispatch }) => {
    await deleteBudgetWS(id);
    return dispatch(fetchBudgets()).unwrap();
  }
);

// Recurring transactions async thunks
export const fetchRecurringTransactions = createAsyncThunk<RecurringTransaction[], void, { state: RootState }>(
  'recurring/list',
  async (_, { getState }) => {
    const state = getState();
    const section = state.dailyExpenses.section;
    return await getRecurringTransactions(true, section);
  }
);

export const createRecurringTransaction = createAsyncThunk<
  RecurringTransaction[],
  CreateRecurringTransaction,
  { state: RootState }
>('recurring/create', async (data: CreateRecurringTransaction, { getState, dispatch }) => {
  const state = getState();
  const section = state.dailyExpenses.section;
  await createRecurringWS(section, data);
  return dispatch(fetchRecurringTransactions()).unwrap();
});

export const updateRecurringTransaction = createAsyncThunk<
  RecurringTransaction[],
  { id: number; data: UpdateRecurringTransaction },
  { state: RootState }
>('recurring/update', async ({ id, data }, { dispatch }) => {
  await updateRecurringWS(id, data);
  return dispatch(fetchRecurringTransactions()).unwrap();
});

export const deleteRecurringTransaction = createAsyncThunk<RecurringTransaction[], number, { state: RootState }>(
  'recurring/delete',
  async (id: number, { dispatch }) => {
    await deleteRecurringWS(id);
    return dispatch(fetchRecurringTransactions()).unwrap();
  }
);

export const fetchRecurringTransactionsDueToday = createAsyncThunk('recurring/due-today', async () => {
  return await getRecurringTransactionsDueToday();
});

type DailyExpenses = {
  section: Section;
  categories: Category[];
  accounts: Account[];
  yearmonth: [number, number];
  summary: TransactionSummary;
  transactions: Transaction[];
  budgets: Budget[];
  recurringTransactions: RecurringTransaction[];
  recurringDueToday: Array<{
    id: number;
    name: string;
    amount: number;
    section: Section;
    category?: { id: number; value: string; emoji?: string };
    account?: { id: number; value: string };
    frequency: string;
    next_execution: string;
    days_overdue: number;
  }>;
};

const dailyExpenseSlice = createSlice<
  DailyExpenses,
  {
    setSection: (state: DailyExpenses, action: PayloadAction<Section>) => void;
    setYearMonth: (state: DailyExpenses, action: PayloadAction<[number, number]>) => void;
  },
  'dailyExpenses',
  SliceSelectors<DailyExpenses>,
  'dailyExpenses'
>({
  name: 'dailyExpenses',
  initialState: {
    section: 'EXPENSE',
    categories: [],
    accounts: [],
    yearmonth: [new Date().getFullYear(), new Date().getMonth()],
    summary: {
      balance: 0,
      expense: 0,
      income: 0,
      investment: 0,
      net_worth: 0,
    },
    transactions: [],
    budgets: [],
    recurringTransactions: [],
    recurringDueToday: [],
  },
  reducers: {
    setSection: (state, action: PayloadAction<Section>) => {
      state.section = action.payload;
    },
    setYearMonth: (state, action: PayloadAction<[number, number]>) => {
      state.yearmonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      state.accounts = action.payload;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    builder.addCase(fetchTransactionsSummary.fulfilled, (state, action) => {
      state.summary = action.payload;
    });
    builder.addCase(createTransfer.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    // Budget reducers
    builder.addCase(fetchBudgets.fulfilled, (state, action) => {
      state.budgets = action.payload;
    });
    builder.addCase(createBudget.fulfilled, (state, action) => {
      state.budgets = action.payload;
    });
    builder.addCase(updateBudget.fulfilled, (state, action) => {
      state.budgets = action.payload;
    });
    builder.addCase(deleteBudget.fulfilled, (state, action) => {
      state.budgets = action.payload;
    });
    // Recurring transaction reducers
    builder.addCase(fetchRecurringTransactions.fulfilled, (state, action) => {
      state.recurringTransactions = action.payload;
    });
    builder.addCase(createRecurringTransaction.fulfilled, (state, action) => {
      state.recurringTransactions = action.payload;
    });
    builder.addCase(updateRecurringTransaction.fulfilled, (state, action) => {
      state.recurringTransactions = action.payload;
    });
    builder.addCase(deleteRecurringTransaction.fulfilled, (state, action) => {
      state.recurringTransactions = action.payload;
    });
    builder.addCase(fetchRecurringTransactionsDueToday.fulfilled, (state, action) => {
      state.recurringDueToday = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSection, setYearMonth } = dailyExpenseSlice.actions;

export default dailyExpenseSlice;
