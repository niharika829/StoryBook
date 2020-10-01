const express = require('express');
const router = express.Router();

//@description:- login landing page
//@rooute :-  /
//@method :- GET

router.get('/', (req, res) => {
	res.render('login', {
		layout: 'login',
		// we personally changed the layout for login page , now this view is no longer having layout/main.hbs as its default layout
	});
});

//@description:- dashboard landing page
//@rooute :-  /dashboard
//@method :- GET

router.get('/dashboard', (req, res) => {
	res.render('dashboard');
});

module.exports = router;
