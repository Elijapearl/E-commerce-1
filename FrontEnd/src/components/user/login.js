import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, Toaster } from 'sonner'; // Import Sonner
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../layouts/loader';
import MetaData from '../layouts/MetaData';

import { login, clearErrors } from '../../actions/userActions';

import '../css/login.css' ;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [hasErrorToast, setHasErrorToast] = useState(false); 
    const dispatch = useDispatch();

    const navigate = useNavigate(); // Use navigate instead of history

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to homepage on successful login
        }

        if (error && !hasErrorToast) {
            toast.error(`Error: ${error}`, {
                duration: Infinity, // Make the toast stay until dismissed
                style: {
                    zIndex: 9999,
                },
            });
            dispatch(clearErrors());
            setHasErrorToast(true); // Ensure the toast doesn't re-trigger
        }
    }, [dispatch, hasErrorToast, isAuthenticated, error, navigate]); // Include navigate in dependencies

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <Fragment>
    <Toaster 
        position="top-right" 
        limit={1} // Display only one toast at a time
    />
    {loading ? (
        <Loader />
    ) : (
        <Fragment>
            <MetaData title="Login" />
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 col-md-8 col-lg-5">
                    <form className="shadow-lg p-4 rounded loginForm" onSubmit={submitHandler}>
                        <h1 className="mb-4 text-center">Login</h1>

                        <div className="form-group mb-3">
                            <label htmlFor="email_field" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control form1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password_field" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control form1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                            <Link to="/password/forgot" className="text-decoration-none">Forgot Password?</Link>
                            <Link to="/" className="text-decoration-none">New User?</Link>
                        </div>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-primary btn-block w-100 py-2"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )}
    </Fragment>

    );
}

export default Login;
