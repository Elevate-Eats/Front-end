import {createSlice} from '@reduxjs/toolkit';

export const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customerInfo: [],
  },

  reducers: {
    setCustomerInfo: (state, action) => {
      state.customerInfo = action.payload;
    },
  },
});

export const {setCustomerInfo} = customerSlice.actions;
export default customerSlice.reducer;
