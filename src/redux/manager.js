import {createSlice} from '@reduxjs/toolkit';

export const managerSlice = createSlice({
  name: 'manager',
  initialState: {
    allManager: [],
  },
  reducers: {
    allManager: (state, action) => {
      state.allManager = action.payload;
    },
  },
});

export const {allManager} = managerSlice.actions;
export default managerSlice.reducer;
