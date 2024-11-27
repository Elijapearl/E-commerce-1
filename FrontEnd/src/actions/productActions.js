import axios from 'axios';

import { 
    ALL_PRODUCTS_REQUEST, 
    ALL_PRODUCTS_SUCCESS, 
    ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';

// Get All Products
export const getProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST });

        // API call to fetch products
        const { data } = await axios.get('/api/v1/products/');

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: {
                products: data.products, // Products from the response
                productsCount: data.products.length // Total number of products
            },
        });

    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: 
                error.response && error.response.data.message
                    ? error.response.data.message // Backend error message
                    : error.message, // Fallback to generic error message
        });
    }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
};
