import {createSlice} from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    reduxItems: {},
    backendItems: {},
  },

  reducers: {
    // !For cart items in bottomSheet to redux
    addItem: (state, action) => {
      const transactionId = parseInt(action.payload.transactionId, 10);
      const newItems = action.payload;
      if (!state.reduxItems[transactionId]) {
        state.reduxItems[transactionId ? transactionId : 0] = [];
      }
      const index = state.reduxItems[transactionId].findIndex(
        item => item.menuid === newItems.menuid,
      );

      if (index >= 0) {
        state.reduxItems[transactionId].map(item => {
          if (newItems.menuid === item.menuid) {
            state.reduxItems[transactionId][index].count += newItems.count;
            state.reduxItems[transactionId][index].totalprice +=
              newItems.totalprice;
            // if (newItems.disc !== undefined) {
            //   state.reduxItems[transactionId][index].disc += newItems.disc;
            // }
          }
        });
      } else {
        // state.reduxItems[transactionId].push(newItems);
        state.reduxItems[transactionId].push({
          ...newItems,
          totalprice: newItems.totalprice,
        });
      }
    },
    removeItem: (state, action) => {
      const {transactionId, menuId} = action.payload;
      if (state.reduxItems[transactionId]) {
        state.reduxItems[transactionId] = state.reduxItems[
          transactionId
        ].filter(item => item.menuId !== menuId);
      }
    },
    removeTransaction: (state, action) => {
      const {transactionId} = action.payload;
      delete state.reduxItems[transactionId.toString()];
      // delete state.allItems[transactionId.toString()];
    },

    // !get Item from backend
    saveItem: (state, action) => {
      const transactionId = parseInt(action.payload[0].transactionId);
      if (!state.backendItems[transactionId]) {
        state.backendItems[transactionId] = [];
      }
      state.backendItems[transactionId] = action.payload;
    },

    updateItem: (state, action) => {
      const transactionId = parseInt(action.payload.transactionId, 10);
      const newItems = action.payload;
      if (newItems.hasOwnProperty('id')) {
        const index = state.backendItems[transactionId].findIndex(
          item => item.id === newItems.id,
        );

        if (index !== -1) {
          state.backendItems[transactionId][index] = {
            ...state.backendItems[transactionId][index],
            ...newItems,
          };
        } else {
          state.backendItems[transactionId].push({...newItems});
        }
      } else {
        const index = state.reduxItems[transactionId]?.findIndex(
          item => item.menuid === newItems.menuid,
        );
        if (index !== -1) {
          state.reduxItems[transactionId][index] = {
            ...state.reduxItems[transactionId][index],
            ...newItems,
          };
        } else {
          if (!state.reduxItems[transactionId]) {
            state.reduxItems[transactionId] = [];
          }
          state.reduxItems[transactionId].push({...newItems});
        }
      }
    },
    clearReduxItems: state => {
      state.reduxItems = {};
    },
  },
});

export const {
  addItem,
  removeItem,
  saveItem,
  removeTransaction,
  updateItem,
  clearReduxItems,
} = cartSlice.actions;
export default cartSlice.reducer;
