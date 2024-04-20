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
      state.allTransaction = state.allTransaction.filter(
        trasaction => trasaction.id !== action.payload,
      );
    },
    addTransaction: (state, action) => {
      state.allTransaction.push(action.payload);
    },
  },
});

export const {allTransaction, deleteTransaction, addTransaction} =
  showTransactionSlice.actions;
export default showTransactionSlice.reducer;
