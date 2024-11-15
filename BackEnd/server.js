const app = require('./app')

const dotenv = require('dotenv')

//This code tells server.js where to find the port
dotenv.config({path: 'BackEnd/config/.env'})

app.listen(process.env.PORT, () =>{
    console.log(`Listening on Port: ${process.env.PORT} and currently in ${process.env.NODE_ENV}`)
})