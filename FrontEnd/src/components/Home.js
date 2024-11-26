import React, { Fragment, useEffect } from 'react';
import './css/home.css';

import MetaData from './layouts/MetaData';

import { useDispatch, useSelector } from 'react-redux';

import { getProducts } from '../actions/productActions';

import Product from './product/Product';

import Loader from './layouts/loader';
const Home = () => {
    const dispatch = useDispatch();
    const { loading, products, error, productsCount} = useSelector(state => state.products)

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    return (
        <Fragment>
            {loading ? <Loader/> : (
                <Fragment> 
                    <MetaData title={'Homepage'} />
                    <div className='container-1'>
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
                            {products && products.map(product => (
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
