import {createSlice} from '@reduxjs/toolkit';

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionId: null,
  },
  reducers: {
    setTransactionId: (state, action) => {
      state.transactionId = action.payload;
    },
  },
});

export const {setTransactionId} = transactionSlice.actions;
export default transactionSlice.reducer;
