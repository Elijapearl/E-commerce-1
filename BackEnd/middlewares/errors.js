const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}

        error.message = err.message;

        /*
        Wrong Mongo id error message
        so ito is if hindi nag eexist ung id na ginamit mo for GET request a product
        lalabas na error 
        this code just make sure na tama yung error na lalabas pag nagka error
        */
        if(err.name === 'CastError'){
            const message = `Product not found, Invalid ID: ${err.path}`;
            err = new ErrorHandler(message, 400);
        }


        /*
        This handles the mongoose validation error
        so lalabas ung error if nag enter ng data and kulag ng laman like 
        kulang ng name ung product or kulang ng kahit anong product na required ang nilagay ko 
        sa schema
        */

        if (err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message);
            err = new ErrorHandler(message, 400);
        }

        //Handling Mongoose duplicate Key Error
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            err = new ErrorHandler(message, 400);
        }

        //Handling wrong jwt error 
        if(err.name === 'JsonWebTokenError'){{
            const message = `JSON Web Token is Invalid`;
            err = new ErrorHandler(message, 400);
        }}

        //Handling wrong jwt expired error
        if(err.name === 'TokenExpiredError'){{
            const message = `JSON Web Token is Expired. Please try again`;
            err = new ErrorHandler(message, 400);
        }}

        res.status(error.statusCode).json({
            success: false,
            error: err.message || 'Inernal Server Error'
        })
    }
}