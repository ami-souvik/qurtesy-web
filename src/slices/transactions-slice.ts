import { createAsyncThunk, createSlice, PayloadAction, type SliceSelectors } from '@reduxjs/toolkit';
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
  getProfiles,
  createProfile as createProfileWS,
  updateProfile as updateProfileWS,
  deleteProfile as deleteProfileWS,
} from '../webservices/profiles-ws';
import {
  PersonalFinanceSection,
  Transaction,
  TransactionSummary,
  Budget,
  CreateBudget,
  UpdateBudget,
  RecurringTransaction,
  CreateRecurringTransaction,
  UpdateRecurringTransaction,
  Profile,
  CreateProfile,
  UpdateProfile,
} from '../types';
import { CreateTransfer } from '../types/transfer';
import { RootState } from '../store/index.types';

// Profile async thunks
export const fetchProfiles = createAsyncThunk<Profile[], void>('profiles/list', async () => {
  return await getProfiles();
});

export const createProfile = createAsyncThunk<Profile[], CreateProfile>(
  'profiles/create',
  async (data: CreateProfile, { dispatch }) => {
    await createProfileWS(data);
    return dispatch(fetchProfiles()).unwrap();
  }
);

export const updateProfile = createAsyncThunk<Profile[], UpdateProfile>(
  'profiles/update',
  async (data: UpdateProfile, { dispatch }) => {
    const { id, ...rest } = data;
    await updateProfileWS(id, rest);
    return dispatch(fetchProfiles()).unwrap();
  }
);

export const deleteProfile = createAsyncThunk<Profile[], number>(
  'profiles/delete',
  async (id: number, { dispatch }) => {
    await deleteProfileWS(id);
    return dispatch(fetchProfiles()).unwrap();
  }
);

export const createTransfer = createAsyncThunk<Transaction[], CreateTransfer, { state: RootState }>(
  'transfers/create',
  async (data: CreateTransfer) => {
    await postTransfer(data);
  }
);

// Budget async thunks
export const fetchBudgets = createAsyncThunk<Budget[], void, { state: RootState }>(
  'budgets/list',
  async (_, { getState }) => {
    const state = getState();
    const [year, month] = state.transactions.yearmonth;
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
    const section = state.transactions.section;
    return await getRecurringTransactions(true, section);
  }
);

export const createRecurringTransaction = createAsyncThunk<
  RecurringTransaction[],
  CreateRecurringTransaction,
  { state: RootState }
>('recurring/create', async (data: CreateRecurringTransaction, { getState, dispatch }) => {
  const state = getState();
  const section = state.transactions.section;
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

type Transactions = {
  profiles: Profile[];
  yearmonth: [number, number];
  summary: TransactionSummary;
  transactions: Transaction[];
  budgets: Budget[];
  recurringTransactions: RecurringTransaction[];
  recurringDueToday: Array<{
    id: number;
    name: string;
    amount: number;
    section: PersonalFinanceSection;
    category?: { id: number; value: string; emoji?: string };
    frequency: string;
    next_execution: string;
    days_overdue: number;
  }>;
};

const transacionsSlice = createSlice<
  Transactions,
  {
    setYearMonth: (state: Transactions, action: PayloadAction<[number, number]>) => void;
  },
  'transactions',
  SliceSelectors<Transactions>,
  'transactions'
>({
  name: 'transactions',
  initialState: {
    profiles: [],
    yearmonth: [new Date().getFullYear(), new Date().getMonth()],
    summary: {
      balance: 0,
      expense: 0,
      income: 0,
      investment: 0,
      net_worth: 0,
    },
    budgets: [],
    recurringTransactions: [],
    recurringDueToday: [],
  },
  reducers: {
    setYearMonth: (state, action: PayloadAction<[number, number]>) => {
      state.yearmonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Profile reducers
    builder.addCase(fetchProfiles.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(createProfile.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(deleteProfile.fulfilled, (state, action) => {
      state.profiles = action.payload;
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
export const { setYearMonth } = transacionsSlice.actions;

export default transacionsSlice;
