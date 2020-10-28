const express = require('express');
const router = express.Router();

const Story = require('../models/Story');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
//@description:- login landing page
//@rooute :-  /
//@method :- GET

router.get('/', ensureGuest, (req, res) => {
	res.render('login', {
		layout: 'login',
		// we personally changed the layout for login page , now this view is no longer having layout/main.hbs as its default layout, now it has a default layout of layout/login.hbs
	});
});

//@description:- dashboard landing page
//@rooute :-  /dashboard
//@method :- GET

router.get('/dashboard', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ user: req.user.id }).lean();

		//in order to pass the values taken from NOSQL database to templates like handlebar we have to convert the data into js object for that we use lean
		console.log(req.user);
		res.render('dashboard', {
			name: req.user.firstName,
			stories,
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.render('error/500');
	}
});
module.exports = router;
