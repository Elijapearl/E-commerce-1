import { 
    ALL_PRODUCTS_REQUEST, 
    ALL_PRODUCTS_SUCCESS, 
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS, 
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';

export const productsReducer = (state = { products: [], productsCount: 0 }, action) => {
    switch (action.type) {
        case ALL_PRODUCTS_REQUEST:
            return {
                ...state, // Preserve existing state if needed
                loading: true,
                error: null, // Clear any previous errors
            };

            case ALL_PRODUCTS_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    products: action.payload.products,
                    productsCount: action.payload.productsCount, // Total number of products
                    resPerPage: action.payload.resPerPage,
                };
            
        case ALL_PRODUCTS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload, // Error message from the action
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null, // Clear errors from the state
            };

        default:
            return state;
    }
};
// In productReducers.js
export const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,// Set loading to true when request is made
            };

        case PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false, // Set loading to false when data is successfully fetched
                product: action.payload, // Set the fetched product data into state
            };

        case PRODUCT_DETAILS_FAIL:
            return {
                ...state,
                loading: false, // Set loading to false on failure
                error: action.payload, // Save the error message in the state
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null, // Reset errors
            };

        default:
            return state;
    }
};
