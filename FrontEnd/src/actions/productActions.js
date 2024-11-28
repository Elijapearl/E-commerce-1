    import axios from 'axios';

    import { 
        ALL_PRODUCTS_REQUEST, 
        ALL_PRODUCTS_SUCCESS, 
        ALL_PRODUCTS_FAIL,
        PRODUCT_DETAILS_REQUEST,
        PRODUCT_DETAILS_SUCCESS, 
        PRODUCT_DETAILS_FAIL,
        CLEAR_ERRORS
    } from '../constants/productConstants';

    // Get All Products
    export const getProducts = (keyword = '', currentPage = 1) => async (dispatch) => {
        try {
            dispatch({ type: ALL_PRODUCTS_REQUEST });

            // API call to fetch products
            const { data } = await axios.get(`/api/v1/products?keyword=${keyword}&page=${currentPage}`);

            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: {
                    products: data.products, // Products for the current page
                    productsCount: data.productsCount, // Total number of products in the database
                    resPerPage: data.resPerPage, // Results per page
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
    //Get all product details
    
// Get Product Details
// In productActions.js
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        // API call to fetch product details
        const { data } = await axios.get(`/api/v1/product/${id}`);
        
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product, // Assuming the product data comes from `data.product`
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

    // Clear Errors
    export const clearErrors = () => (dispatch) => {
        dispatch({
            type: CLEAR_ERRORS,
        });
    };
