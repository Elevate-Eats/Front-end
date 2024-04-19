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
    deleteTransaction: (state, action) => {
      state.allTransaction = state.allTransaction.filter(trasaction => trasaction.id !== action.payload)
    }
  },
});

export const {allTransaction, deleteTransaction} = showTransactionSlice.actions;
export default showTransactionSlice.reducer;
