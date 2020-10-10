const express = require('express');
const router = express.Router();
const Story = require('../models/Story')
const { ensureAuth, ensureGuest } = require('../middleware/auth');
//@description:- login landing page
//@rooute :-  /
//@method :- GET

router.get('/', ensureGuest, (req, res) => {
	res.render('login', {
		layout: 'login',
		// we personally changed the layout for login page , now this view is no longer having layout/main.hbs as its default layout
	});
});

//@description:- dashboard landing page
//@rooute :-  /dashboard
//@method :- GET

router.get('/dashboard', ensureAuth, (req, res) => {
	console.log(req.user);
	res.render('dashboard',{
		name: req.user.firstName,
	});
});

module.exports = router;
