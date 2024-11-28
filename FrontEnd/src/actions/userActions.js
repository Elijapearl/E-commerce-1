
import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    CLEAR_ERRORS
} from '../constants/userConstants'


export const login = (email, password) => async (dispatch) => {
    try{
        dispatch({ type: LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/login', {email, password}, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
        

    }catch(error){
        dispatch({
            type: LOGIN_FAILED,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
};
