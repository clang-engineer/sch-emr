// types
import { MenuProps } from './types/menu';
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { useAppDispatch } from 'app/config/store';
import axios from 'axios';
import { finderWidthNarrow } from 'app/modules/emr-viewer/constant';

// initial state
const initialState = {
  selectedItem: ['dashboard'],
  selectedID: null,
  drawerOpen: true,
  error: null,
  menu: {},
  alert: null,
  viewMode: 'single',
  finderWidth: finderWidthNarrow,
  profile: 'local',
};

// ==============================|| SLICE - MENU ||============================== //

const emrLayout = createSlice({
  name: 'emr-layout',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.selectedItem = action.payload;
    },

    activeID(state, action) {
      state.selectedID = action.payload;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },

    // has error
    hasError(state, action) {
      state.error = action.payload;
    },

    // get dashboard menu
    getMenuSuccess(state, action) {
      state.menu = action.payload;
    },
    setAlert(state, action) {
      state.alert = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    setFinderWidth(state, action) {
      state.finderWidth = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
  },
});

export default emrLayout.reducer;

export const { activeItem, openDrawer, activeID } = emrLayout.actions;

export const setAlert = (alert: string | null) => {
  const dispatch = useAppDispatch();
  dispatch(emrLayout.actions.setAlert(alert));
};

export const setViewMode = (viewMode: string) => {
  const dispatch = useAppDispatch();
  dispatch(emrLayout.actions.setViewMode(viewMode));
};

export const setFinderWidth = (finderWidth: number) => {
  const dispatch = useAppDispatch();
  dispatch(emrLayout.actions.setFinderWidth(finderWidth));
};

export const setProfile = (profile: string) => {
  const dispatch = useAppDispatch();
  dispatch(emrLayout.actions.setProfile(profile));
};

export function getMenu() {
  const dispatch = useAppDispatch();
  return async () => {
    try {
      const response = await axios.get('/api/menu/widget');
      dispatch(emrLayout.actions.getMenuSuccess(response.data.widget));
    } catch (error) {
      dispatch(emrLayout.actions.hasError(error));
    }
  };
}
