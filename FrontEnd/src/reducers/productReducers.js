import { 
    ALL_PRODUCTS_REQUEST, 
    ALL_PRODUCTS_SUCCESS, 
    ALL_PRODUCTS_FAIL,
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
                products: action.payload.products, // Extracted from payload
                productsCount: action.payload.productsCount, // Extracted from payload
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
