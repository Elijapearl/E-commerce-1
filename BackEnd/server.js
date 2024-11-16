const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv')

//handle uncaught exceptions
process.on('uncaughtException', err => {
    console.error(`Error: ${err.message}`)
    console.error('Shutting down the server due to uncaught exception')
    process.exit(1)
})

//This code tells server.js where to find the port
dotenv.config({path: 'BackEnd/config/.env'})


//Here I connect to the database
connectDatabase();

const server = app.listen(process.env.PORT, () =>{
    console.log(`Listening on Port: ${process.env.PORT} and currently in ${process.env.NODE_ENV}`)
})

//handle unhandled promise exceptions

process.on('unhandledRejection', err => {
    console.error(`Error: ${err.message}`)
    console.error('Shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})

