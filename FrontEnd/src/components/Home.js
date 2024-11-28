import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For React Router v6
import Search from './layouts/Searching'

import './css/home.css';
import Pagination from 'react-js-pagination';
import MetaData from './layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';

import Product from './product/Product';
import Loader from './layouts/loader';
import { toast, Toaster } from 'sonner'; // Import Sonner

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();
    const { loading, products, error, productsCount, resPerPage } = useSelector((state) => state.products);
    const [hasErrorToast, setHasErrorToast] = useState(false); // Track if error toast is shown

    const { keyword = "" } = useParams(); // Use useParams for React Router v6

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
        dispatch(getProducts(keyword, currentPage)); // Dispatch with keyword and currentPage
    }, [dispatch, error, hasErrorToast, currentPage, keyword]); // Added keyword to dependencies

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber);
    }

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

                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h1 id="products_heading" className="mb-3 mb-md-0">Products</h1>

                        <div className="col-12 col-md-6 mt-2 mt-md-0">
                            <Search />
                        </div>
                    </div>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                    </section>

                    {resPerPage < productsCount && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass='page-item'
                                linkClass='page-link'
                            />
                        </div> 
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
