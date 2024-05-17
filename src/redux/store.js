import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import branchReducer from './branchSlice';
import menuReducer from './menuSlice';
import customerReducer from './customerSlice';
import transactionReducer from './transactionSlice';
import employeeReducer from './employee';
import managerReducer from './manager';
import showTransactionReducer from './showTransaction';
import allItemsReducer from './allItems';
import pcsReducer from './pcsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    branch: branchReducer,
    menu: menuReducer,
    customer: customerReducer,
    transaction: transactionReducer,
    employee: employeeReducer,
    manager: managerReducer,
    showTransaction: showTransactionReducer,
    allItems: allItemsReducer,
    pcs: pcsReducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({serializableCheck: false});
  },
});
