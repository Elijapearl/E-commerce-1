import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import for `redux-thunk`
import { composeWithDevTools } from '@redux-devtools/extension';

import { productsReducer, productDetailsReducer } from './reducers/productReducers';
import { authReducer } from './reducers/userReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetail: productDetailsReducer,
    auth: authReducer   
});


let initialState = {};

const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
