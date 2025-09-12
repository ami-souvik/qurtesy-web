import { PayloadAction, createSlice, type SliceSelectors } from '@reduxjs/toolkit';

type State = {
  loading: boolean;
};

const stateSlice = createSlice<
  State,
  {
    setLoading: (state: State, action: PayloadAction<boolean>) => void;
  },
  'state',
  SliceSelectors<State>,
  'state'
>({
  name: 'state',
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state: State, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: () => {},
});

// Action creators are generated for each case reducer function
export const { setLoading } = stateSlice.actions;

export default stateSlice;
