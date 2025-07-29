import { PayloadAction, createSlice, type SliceSelectors } from '@reduxjs/toolkit';

type State = {
  loading: boolean;
  baseUrl: string;
};

const stateSlice = createSlice<
  State,
  {
    setLoading: (state: State, action: PayloadAction<boolean>) => void;
    setBaseUrl: (state: State, action: PayloadAction<string>) => void;
  },
  'state',
  SliceSelectors<State>,
  'state'
>({
  name: 'state',
  initialState: {
    loading: false,
    baseUrl: '',
  },
  reducers: {
    setLoading: (state: State, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBaseUrl: (state: State, action: PayloadAction<string>) => {
      state.baseUrl = action.payload;
    },
  },
  extraReducers: () => {},
});

// Action creators are generated for each case reducer function
export const { setLoading, setBaseUrl } = stateSlice.actions;

export default stateSlice;
