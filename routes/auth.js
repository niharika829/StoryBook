const express = require('express');
const passport = require('passport');
const router = express.Router();
const toast = require('powertoast');
// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
	const toasty = toast({
		appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
		title: 'Koya',
		message: 'Log In Successfull',
		icon: 'D:\\Desktop\\25231.png',
		attribution: 'Via Web',
	}).catch((err) => console.error(err));
	if (toasty) res.redirect('/dashboard');
});
//so if the authentication is successfull then it will take us to the dashboard, if not it will redirect to the main page

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
	const toastify = toast({
		appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
		icon: 'D:\\Desktop\\25231.png',
		title: 'Koya',
		message: 'Log Out Successfull',
		attribution: 'Via Web',
	}).catch((err) => console.error(err));
	if (toastify) {
		req.logOut();
		res.redirect('/');
	}
});
module.exports = router;
