import { createSlice, type SliceSelectors } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type RealDB = {};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const realdbSlice = createSlice<RealDB, {}, 'realdb', SliceSelectors<RealDB>, 'realdb'>({
  name: 'realdb',
   
  initialState: {},
   
  reducers: {},
  extraReducers: () => {
     
  },
});

// Action creators are generated for each case reducer function
// eslint-disable-next-line no-empty-pattern
export const {} = realdbSlice.actions;

export default realdbSlice;
