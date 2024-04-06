import {createSlice} from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },

  reducers: {
    addItem: (state, action) => {
      const existingItems = state.items.find(
        item => item.id === action.payload.id,
      );
      if (existingItems) {
        existingItems.count += action.payload.count;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
  },
});

export const {addItem, removeItem} = cartSlice.actions;
export default cartSlice.reducer;
