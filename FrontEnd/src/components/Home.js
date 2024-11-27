import React, { Fragment, useEffect, useState } from 'react';
import './css/home.css';

import MetaData from './layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';

import Product from './product/Product';
import Loader from './layouts/loader';
import { toast, Toaster } from 'sonner'; // Import Sonner

const Home = () => {
    const dispatch = useDispatch();
    const { loading, products, error } = useSelector((state) => state.products);
    const [hasErrorToast, setHasErrorToast] = useState(false); // Track if error toast is shown

    useEffect(() => {
        if (error && !hasErrorToast) {
            toast.error(`Error: ${error}`, {
                duration: Infinity, // Make the toast stay until dismissed
                style: {
                    zIndex: 9999,
                },
            });
            setHasErrorToast(true); // Ensure the toast doesn't re-trigger
        }
        dispatch(getProducts());
    }, [dispatch, error, hasErrorToast]); // Add `hasErrorToast` to dependencies

    return (
        <Fragment>
            <Toaster 
                position="top-right" 
                limit={1} // Display only one toast at a time
            />
            {loading ? (
                <Loader />
            ) : error ? (
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            ) : (
                <Fragment>
                    <MetaData title={'Homepage'} />
                    <div className="container-1">
                        <div className="hero-section">
                            <div className="hero-content">
                                <div className="hero-inside">
                                    <h1>Mente Exceptional</h1>
                                    <p>"Mente Exceptional Inc. is a vibrant e-commerce platform offering exceptional products and a seamless shopping experience to meet diverse customer needs."</p>
                                    <button className="btn-shop-now">SHOP NOW</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 id="products_heading">Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
