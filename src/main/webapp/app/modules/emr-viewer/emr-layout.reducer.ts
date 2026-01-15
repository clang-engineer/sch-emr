import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  drawerOpen: true,
  error: null,
  viewMode: 'single',
};

// ==============================|| SLICE - MENU ||============================== //

const emrLayout = createSlice({
  name: 'emr-layout',
  initialState,
  reducers: {
    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },
    hasError(state, action) {
      state.error = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
  },
});

export default emrLayout.reducer;

export const { openDrawer, setViewMode: setViewModeAction } = emrLayout.actions;
