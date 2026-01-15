import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  drawerOpen: true,
  viewMode: 1,
  error: null,
};

// ==============================|| SLICE - MENU ||============================== //

const emrLayout = createSlice({
  name: 'emr-layout',
  initialState,
  reducers: {
    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    hasError(state, action) {
      state.error = action.payload;
    },
  },
});

export default emrLayout.reducer;

export const { openDrawer, setViewMode } = emrLayout.actions;
