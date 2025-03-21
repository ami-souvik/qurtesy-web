import { combineSlices, configureStore } from '@reduxjs/toolkit';
import dailyExpenseSlice from './slices/daily-expenses-slice';

const rootReducer = combineSlices(dailyExpenseSlice);

export default configureStore({
  reducer: rootReducer,
});
