const mongoose = require('mongoose');

//working with promises
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		//this will let us know about the host connection.
		console.log(`mongoose connected : ${conn.connection.host}`);
	} catch (err) {
		//if connection was not made successfully
		console.error(err);
		process.exit(1);
		//1 represent failure
	}
};
module.exports = connectDB;
