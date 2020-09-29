const mongoose = require('mongoose');

//working with promises
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log(`mongoose connected : ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
		//1 represent failure
	}
};
module.exports = connectDB;
