import { combineSlices, configureStore } from '@reduxjs/toolkit';
import dailyExpenseSlice from './slices/daily-expenses-slice';

const rootReducer = combineSlices(dailyExpenseSlice);

const store = configureStore({
  reducer: rootReducer,
});

export default store;
