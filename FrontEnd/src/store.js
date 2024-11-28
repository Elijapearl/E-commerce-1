import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import for `redux-thunk`
import { composeWithDevTools } from '@redux-devtools/extension';

import { productsReducer, productDetailsReducer } from './reducers/productReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetail: productDetailsReducer,
});

let initialState = {};

const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
