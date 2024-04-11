import {createSlice} from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },

  reducers: {
    addItem: (state, action) => {
      const existingItems = state.items.find(
        item => item.id === action.payload.menuid,
      );
      if (existingItems) {
        existingItems.count += action.payload.count;
        existingItems.totalPrice += action.payload.totalPrice;
        existingItems.disc += action.payload.disc;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        item => item.id !== action.payload.menuid,
      );
    },

    saveItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const {addItem, removeItem, saveItem} = cartSlice.actions;
export default cartSlice.reducer;
