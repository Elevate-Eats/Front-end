import {createSlice} from '@reduxjs/toolkit';

export const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    selectedBranch: null,
    allBranch: [],
  },

  reducers: {
    selectBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    allBranch: (state, action) => {
      state.allBranch = action.payload;
    },
    addBranch: (state, action) => {
      state.allBranch.push(action.payload);
    },
    deleteBranch: (state, action) => {
      state.allBranch = state.allBranch.filter(
        branch => branch.id !== action.payload,
      );
    },
  },
});

export const {selectBranch, allBranch, deleteBranch, addBranch} =
  branchSlice.actions;
export default branchSlice.reducer;
