const express = require('express');
const dotenv = require('dotenv'); //it will have all the config variables
const connectDB = require('./config/db');

//to load config
dotenv.config({ path: './config/config.env' });

connectDB();
//with the help of process.env i can use/access values from config
const PORT = process.env.PORT || 5000;

const app = express();
app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
