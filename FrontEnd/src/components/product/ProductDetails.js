// ProductDetails.js

import React, { Fragment, useEffect } from 'react';
import Loader from '../layouts/loader';
import MetaData from '../layouts/MetaData';
import '../css/productDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useParams to get the product ID from the URL
import { getProductDetails, clearErrors } from '../../actions/productActions';
import { Carousel } from 'react-bootstrap'

function ProductDetails() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Extract `id` from the URL params

    const { loading, error, product } = useSelector(state => state.productDetail); // Access product details from the Redux store

    useEffect(() => {
        dispatch(getProductDetails(id)); // Dispatch action to fetch product details by ID

        if (error) {
            // Handle error if any
            dispatch(clearErrors());
        }
    }, [dispatch, error, id]);

    return (
        <Fragment>
            <MetaData title={`${product?.name}`} />
            {loading ? (
                <Loader /> // Show loader while fetching
            ) : (
                <Fragment>
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid border border-dark" id="product_image">
                            <Carousel pause='hover'>
                                {product?.images && product.images.map(image => (
                                <Carousel.Item key={image.public_id}>
                                    <img className='image1 d-block w-100' src={image.url} alt={product.title} />
                                </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h2>{product?.name}</h2> 
                            <p id="product_id">ID: {product?._id}</p>

                            <hr />

                            <p id="product_price">₱ {product?.price}</p>
                            <div className="stockCounter d-inline">
                                
                                <hr />
                                <span className="btn btn-dark minus">-</span>
                                <input type="number" className="text-center count d-inline mx-3" value="1" readOnly />

                                <span className="btn btn-dark plus me-2">+</span>
                            </div>
                            <button type="button" id="cart_btn" className="btn btn-outline- ark d-inline">
                                Add to Cart
                            </button>

                            <hr />

                            <p>
                                Status: 
                                <span 
                                    className={product.stock > 0 ? "blackColor" : "redColor"} 
                                    id="stock_status"
                                >
                                    {product.stock > 0 ? ` In Stock (${product.stock}) pcs.` : ' Out of stock'}
                                </span>
                            </p>


                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p className='description'>
                                {product.description}
                            </p>
                            <hr />
                            <p id="product_seller" className="mb-3">
                                Distributed by: <strong>Mente Exceptional Inc.</strong>
                            </p>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}

export default ProductDetails;
