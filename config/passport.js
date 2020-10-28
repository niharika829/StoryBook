//This module lets you authenticate using Google in your Node.js applications
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
//user details model
const User = require('../models/User');

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				/*here we have provided the unique ID and Secret along with the redirect url ,
				same url has been passes while creating credentials in order to authenticate*/
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				//detailed info about the user after successful login through their gmail account
				//console.log(profile);
				const newUser = {
					googleId: profile.id,
					displayName: profile.displayName,
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					image: profile.photos[0].value,
				};
				try {
					//first we will check if the user exist with this email id by using findOne
					let user = await User.findOne({ googleId: profile.id });
					/*if exist , it means user has already become a member in the past and is now logging in instead of signing up*/
					if (user) {
						done(null, user); //middleware
					} else {
						//if user came here for the first time then create an entry wuth a new user
						user = await User.create(newUser);
						done(null, user); //middleware
					}
				} catch (err) {
					//error handling
					console.error(err);
				}
			}
		)
	);
	//serializeUser determines which data of the user object should be stored in the session.
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	/*	The user id (provided as the second argument of the done function in line number 32 or 36) is saved in the
	 session and is later used to retrieve the whole object via the deserializeUser function.*/
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user));
	});
};
