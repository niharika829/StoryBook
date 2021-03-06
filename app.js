const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //it will have all the config variables
const connectDB = require('./config/db');
const morgan = require('morgan');
// morgan is used for logging.. so in the prject at any time if any request will be made (even between different webpages) ,it will be displayed on the console
const session = require('express-session');
//creating sessions
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const passport = require('passport');
const exphbs = require('express-handlebars');
const { Mongoose } = require('mongoose');

//to load config
dotenv.config({ path: './config/config.env' });
require('./config/passport')(passport); //passed the passport const to config/passport.js so that i can use it there
connectDB();

//with the help of process.env i can use/access values from config
const PORT = process.env.PORT || 5000;

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//so that we can pass hidden methods like PUT and  DELETE ,while the form will be having a method as POST
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

if (process.env.NODE_ENV === 'development') {
	//use midddleware
	app.use(morgan('dev'));
}

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

//this will aloow us to use .hbs extension instead of .handlebars
//defaultlayout will contain all the layouts which we dont want to repeat again and again,so all the other layouts will be wrapped inside this default layout
app.engine(
	'.hbs',
	exphbs({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultlayout: 'main', extname: '.hbs' })
);
app.set('view engine', '.hbs');

app.use(
	session({
		secret: 'keyboard cat', //it can be anything
		resave: false, //do not resave the session if nothing is changed
		saveUninitialized: false, //do not create a session until nothing is stored in it
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session()); //to work with passport sessions we need express-session

//set a var which can be accessed everywhere inside the application
app.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});

//static public folder
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));
app.use('/Not-Found', function (req, res) {
	res.statusCode = 404;

	res.render('error/404');
});
// any invalid route will be redirected to route "/Not-Found"
app.get('/*', function (req, res) {
	res.redirect('/Not-Found');
});
app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
