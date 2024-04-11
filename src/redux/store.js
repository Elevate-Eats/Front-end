import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import branchReducer from './branchSlice';
import menuReducer from './menuSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    branch: branchReducer,
    menu: menuReducer,
  },
});
