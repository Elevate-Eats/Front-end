import {createSlice} from '@reduxjs/toolkit';

export const showTransactionSlice = createSlice({
  name: 'showTransaction',
  initialState: {
    allTransaction: [],
  },

  reducers: {
    allTransaction: (state, action) => {
      state.allTransaction = action.payload;
    },
  },
});

export const {allTransaction} = showTransactionSlice.actions;
export default showTransactionSlice.reducer;
