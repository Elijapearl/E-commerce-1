const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI)
        .then(con => {
            console.log(`Connected To The Database with HOST: ${con.connection.host}`);
        })
        .catch(error => {
            console.error('Database connection error:', error);
        });
};

module.exports = connectDatabase;
