import {createSlice} from '@reduxjs/toolkit';

//Menu Company
export const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    selectedMenu: null,
    allMenu: [],
    allMenuBranch: [],
  },

  reducers: {
    selectedMenu: (state, action) => {
      state.selectedMenu = action.payload;
    },
    allMenu: (state, action) => {
      state.allMenu = action.payload;
    },
    allMenuBranch: (state, action) => {
      state.allMenuBranch = action.payload;
    },
    updateMenu: (state, action) => {
      const index = state.allMenu.findIndex(
        menu => menu.id === action.payload.id,
      );
      if (index !== -1) {
        state.allMenu[index] = action.payload;
      }
    },
    deleteMenu: (state, action) => {
      state.allMenu = state.allMenu.filter(
        menu => menu.id !== action.payload.id,
      );
    },
    addMenu: (state, action) => {
      state.allMenu.push(action.payload);
    },
  },
});

export const {
  selectedMenu,
  allMenu,
  updateMenu,
  deleteMenu,
  addMenu,
  allMenuBranch,
} = menuSlice.actions;
export default menuSlice.reducer;
