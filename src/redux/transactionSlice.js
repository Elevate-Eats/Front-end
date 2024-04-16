import {createSlice} from '@reduxjs/toolkit';

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionId: null,
    transactionList: [],
  },
  reducers: {
    setTransactionId: (state, action) => {
      state.transactionId = action.payload;
    },
    setTransactionList: (state, action) => {
      state.transactionList.push(action.payload);
    },
  },
});

export const {setTransactionId, setTransactionList} = transactionSlice.actions;
export default transactionSlice.reducer;
