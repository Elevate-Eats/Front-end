import {createSlice} from '@reduxjs/toolkit';

export const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    selectedBranch: null,
    allBranch: [],
    manyBranch: [],
  },

  reducers: {
    selectBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    allBranch: (state, action) => {
      state.allBranch = action.payload;
    },
    manyBranch: (state, action) => {
      state.manyBranch = action.payload;
    },
  },
});

export const {selectBranch, allBranch, manyBranch} = branchSlice.actions;
export default branchSlice.reducer;
