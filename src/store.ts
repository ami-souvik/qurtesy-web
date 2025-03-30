import { combineSlices, configureStore } from '@reduxjs/toolkit';
import dailyExpenseSlice from './slices/daily-expenses-slice';
// import realdbSlice from './slices/realdb-slice';

const rootReducer = combineSlices(
  dailyExpenseSlice
  // realdbSlice
);

const store = configureStore({
  reducer: rootReducer,
});

export default store;
