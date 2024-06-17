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
    clearManager: state => {
      state.allManager = [];
    },
  },
});

export const {allManager, clearManager} = managerSlice.actions;
export default managerSlice.reducer;
