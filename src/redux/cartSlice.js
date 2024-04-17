import {createSlice} from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    newItems: [],
  },

  reducers: {
    addItem: (state, action) => {
      const transactionId = parseInt(action.payload.transactionId, 10);
      const {...newItems} = action.payload;
      if (!state.items[transactionId]) {
        state.items[transactionId] = [];
        // state.allItems[transactionId] = [];
      }
      const index = state.items[transactionId].findIndex(
        item => item.menuId === newItems.menuId,
      );
      if (index >= 0) {
        state.items[transactionId][index].count += newItems.count;
        state.items[transactionId][index].totalPrice += newItems.totalPrice;
        if (newItems.disc !== undefined) {
          state.items[transactionId][index].disc += newItems.disc;
        }
      } else {
        state.items[transactionId].push(newItems);
      }
    },
    removeItem: (state, action) => {
      const {transactionId, menuId} = action.payload;
      if (state.items[transactionId]) {
        state.items[transactionId] = state.items[transactionId].filter(
          item => item.menuId !== menuId,
        );
      }
    },
    removeTransaction: (state, action) => {
      const {transactionId} = action.payload;
      delete state.items[transactionId.toString()];
      // delete state.allItems[transactionId.toString()];
    },

    saveItem: (state, action) => {
      state.newItems = action.payload;
    },
  },
});

export const {addItem, removeItem, saveItem, removeTransaction} =
  cartSlice.actions;
export default cartSlice.reducer;
