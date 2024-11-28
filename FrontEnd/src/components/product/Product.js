import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import '../css/products.css' ;

function product( {product} ) {
  return (
    <Fragment>
        <div className="col-sm-12 col-md-6 col-lg-3 my-3">
                    <div className="card p-3 rounded product-container">
                        <img
                            className="card-img-top mx-auto product-image"
                            src={product.images[0]?.url} // Use the first image or fallback to a default
                            alt="Img Loading..."
                        />
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">
                                <Link to={`/product/${product._id}`} className="name"  >{product.name}</Link>
                            </h5>
                            
                            <p className="card-text">PHP: {product.price}</p>
                            <Link to={`/product/${product._id}`}
                            id="view_btn" 
                            className="btn btn-block">View Details</Link>
                        </div>
                    </div>
                </div>
                
    </Fragment>
  )
}

export default product
