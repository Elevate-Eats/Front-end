import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import branchReducer from './branchSlice';
import menuReducer from './menuSlice';
import customerReducer from './customerSlice';
import transactionReducer from './transactionSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    branch: branchReducer,
    menu: menuReducer,
    customer: customerReducer,
    transaction: transactionReducer,
  },
});
