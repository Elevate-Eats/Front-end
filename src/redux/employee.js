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
    clearEmployee: state => {
      state.allEmployee = [];
    },
  },
});

export const {allEmployee, clearEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;
