const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv')

//This code tells server.js where to find the port
dotenv.config({path: 'BackEnd/config/.env'})

//Here I connect to the database
connectDatabase();

app.listen(process.env.PORT, () =>{
    console.log(`Listening on Port: ${process.env.PORT} and currently in ${process.env.NODE_ENV}`)
})