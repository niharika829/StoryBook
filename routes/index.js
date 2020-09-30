const express = require('express');
const router = express.Router();

//@description:- login landing page
//@rooute :-  /
//@method :- GET

router.get('/', (req, res) => {
	res.send('login');
});

//@description:- dashboard landing page
//@rooute :-  /dashboard
//@method :- GET

router.get('/dashboard', (req, res) => {
	res.send('dashboard');
});

module.exports = router;
