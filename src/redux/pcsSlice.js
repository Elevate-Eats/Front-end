import {createSlice} from '@reduxjs/toolkit';
import {parse} from 'react-native-svg';

export const pcsSlice = createSlice({
  name: 'pcs',
  initialState: {
    itemsInfo: {},
  },
  reducers: {
    addItemsInfo: (state, action) => {
      const transactionId = parseInt(action.payload[0].transactionId, 10);
      if (!state.itemsInfo[transactionId]) {
        state.itemsInfo[transactionId] = [];
      }
      state.itemsInfo[transactionId] = action.payload;
      //   action.payload.forEach(newItem => {
      //     state.itemsInfo[transactionId] = newItem;
      //   });
      //   action.payload.forEach(newItems => {
      //     const index = state.itemsInfo[transactionId].findIndex(
      //       item => item.id === newItems.id,
      //     );
      //     // state.itemsInfo[transactionId].push(newItems);

      //     if (index >= 0) {
      //       state.itemsInfo[transactionId][index].count += newItems.count;
      //       state.itemsInfo[transactionId][index].totalprice +=
      //         newItems.totalprice;
      //     } else {
      //       state.itemsInfo[transactionId].push(newItems);
      //     }
      //   });
    },
  },
});

export const {addItemsInfo} = pcsSlice.actions;
export default pcsSlice.reducer;
