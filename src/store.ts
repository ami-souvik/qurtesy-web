import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import localforage from 'localforage';
import dailyExpenseSlice from './slices/daily-expenses-slice';
import stateSlice from './slices/state-slice';

/**
 * Persist you redux state using IndexedDB
 * @param {string} dbName - IndexedDB database name
 */
function storage(dbName: string) {
  const db = localforage.createInstance({
    name: dbName,
  });
  return {
    db,
    getItem: db.getItem,
    setItem: db.setItem,
    removeItem: db.removeItem,
  };
}

const persistConfig = {
  key: 'finance',
  storage: storage('finance'),
};

const persistedReducer = persistReducer(persistConfig, stateSlice.reducer);

const rootReducer = combineReducers({
  state: persistedReducer,
  dailyExpenses: dailyExpenseSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['_persist'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Types for TypeScript (optional)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
