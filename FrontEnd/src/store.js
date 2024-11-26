import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Use named import for `thunk`
import { composeWithDevTools } from '@redux-devtools/extension';

import { productsReducer } from './reducers/productReducers';

const reducer = combineReducers({
    products: productsReducer,
    // Add other reducers here if needed
})
  
let initialState = {};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);


export default store;