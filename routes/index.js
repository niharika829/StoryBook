const express = require('express');
const router = express.Router();

//@description:- login landing page
//@rooute :-  /
//@method :- GET

router.get('/', (req, res) => {
	res.render('login');
});

//@description:- dashboard landing page
//@rooute :-  /dashboard
//@method :- GET

router.get('/dashboard', (req, res) => {
	res.render('dashboard');
});

module.exports = router;
