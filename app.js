const express = require('express');
const dotenv = require('dotenv'); //it will have all the config variables
const connectDB = require('./config/db');
const morgan = require('morgan');
// morgan is used for logging.. so in the prject at any time if any request will be made (even between different webpages) ,it will be displayed on the console

//to load config
dotenv.config({ path: './config/config.env' });

connectDB();
//with the help of process.env i can use/access values from config
const PORT = process.env.PORT || 5000;

const app = express();

if (process.env.NODE_ENV === 'development') {
	//use midddleware
	app.use(morgan('dev'));
}
app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
