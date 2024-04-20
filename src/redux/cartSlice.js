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
      const newItems = action.payload;
      // state.items[transactionId] = action.payload
      if (!state.items[transactionId]) {
        state.items[transactionId ? transactionId : 0] = [];
      }
      const index = state.items[transactionId].findIndex(
        item => item.menuid === newItems.menuid,
      );

      if (index >= 0) {
        state.items[transactionId].map(item => {
          if (newItems.menuid === item.menuid) {
            state.items[transactionId][index].count += newItems.count;
            state.items[transactionId][index].totalprice += newItems.totalprice;
            if (newItems.disc !== undefined) {
              state.items[transactionId][index].disc += newItems.disc;
            }
          }
        });
      } else {
        // state.items[transactionId].push(newItems);
        state.items[transactionId].push({
          ...newItems,
          totalprice: newItems.totalprice,
        });
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
    updateItem: (state, action) => {
      const transactionId = parseInt(action.payload.transactionId, 10);
      if (!state.items[transactionId]) {
        state.items[transactionId] = [];
      }
      const index = state.items[transactionId].findIndex(
        item => item.menuid === action.payload.menuid,
      );
      if (index === -1) {
        state.items[transactionId].push({...action.payload});
      } else {
        state.items[transactionId][index] = {
          ...action.payload,
          totalprice:
            action.payload.count * action.payload.price - action.payload.disc,
        };
      }
    },
  },
});

export const {addItem, removeItem, saveItem, removeTransaction, updateItem} =
  cartSlice.actions;
export default cartSlice.reducer;
