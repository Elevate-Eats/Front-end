import {combineReducers} from 'redux';
import {cartReducer} from '.';

const rootReducer = combineReducers({
  cart: cartReducer,
});

const store = createStore();
