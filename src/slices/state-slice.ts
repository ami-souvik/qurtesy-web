import { createSlice, type SliceSelectors } from '@reduxjs/toolkit';

type SidebarTab =
  | 'overview'
  | 'home'
  | 'budget'
  | 'accounts'
  | 'recurring'
  | 'goals'
  | 'investments'
  | 'export'
  | 'import'
  | 'settings';
type State = {
  activeTab: SidebarTab;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const stateSlice = createSlice<State, {}, 'state', SliceSelectors<State>, 'state'>({
  name: 'state',
  initialState: {
    activeTab: 'overview',
  },
  reducers: {},
  extraReducers: () => {},
});

// Action creators are generated for each case reducer function

export default stateSlice;
