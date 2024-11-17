//Error Handler class
//Yung Error is parent class and yung ErrorHandler ang child class
//This is inheritance
class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructure)
    }
}

module.exports = ErrorHandler

//so ung error handler class dito is the one that handles the error
//this makes sure that the error handling code is not repetetive 
//instead na inuulit ulit ko yng error handler na code is gamitin nalang naten ung class na to