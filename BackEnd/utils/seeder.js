const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

//settings dotenv file
dotenv.config({ path: 'BackEnd/config/.env' });

connectDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(products);
        console.log('All Products are added');

        process.exit();
    } catch (error) {  // Error is now correctly defined
        console.log(error.message);
        process.exit(1); // You might want to use status code 1 for errors
    }
};

seedProducts();
