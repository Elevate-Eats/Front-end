import {createSlice} from '@reduxjs/toolkit';

export const allItemsSlice = createSlice({
  name: 'allItems',
  initialState: {
    allItems: [],
  },
  reducers: {
    allItems: (state, action) => {
      state.allItems = action.payload;
    },
  },
});

export const {allItems} = allItemsSlice.actions;
export default allItemsSlice.reducer;
