import {createSlice} from '@reduxjs/toolkit';

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    allEmployee: [],
  },
  reducers: {
    allEmployee: (state, action) => {
      state.allEmployee = action.payload;
    },
  },
});

export const {allEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;
