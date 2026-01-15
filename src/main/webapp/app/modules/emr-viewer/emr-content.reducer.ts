import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface HtmlSet {
  id: string;
  html: string;
  createdAt?: string;
}

interface EmrContentState {
  items: HtmlSet[];
}

const initialState: EmrContentState = {
  items: [],
};

const emrContent = createSlice({
  name: 'emr-content',
  initialState,
  reducers: {
    addHtmlSet(state, action: PayloadAction<HtmlSet>) {
      state.items.push(action.payload);
    },
    removeHtmlSet(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setHtmlSets(state, action: PayloadAction<HtmlSet[]>) {
      state.items = action.payload;
    },
    clearHtmlSets(state) {
      state.items = [];
    },
  },
});

export default emrContent.reducer;
export const { addHtmlSet, removeHtmlSet, setHtmlSets, clearHtmlSets } = emrContent.actions;
