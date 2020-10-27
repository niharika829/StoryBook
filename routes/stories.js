const express = require('express');
const router = express.Router();
const toast = require('powertoast');
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');
//@desc    add stories
//@route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
	res.render('stories/add');
});
//@desc    process form data
//@route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		toast({
			appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
			title: 'Koya',
			message: 'Story Created',
			icon: 'D:\\Desktop\\25231.png',
			attribution: 'Via Web',
		}).catch((err) => console.error(err));

		res.redirect('/dashboard');
	} catch (err) {
		console.log(err);
		res.statusCode = 500;
		res.render('error/500');
	}
});

//@desc    show all stories
//@route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ status: 'public' }).populate('user').sort({ createdAt: 'desc' }).lean();
		res.render('stories/index', {
			stories,
		});
	} catch (err) {
		console.log(err);
		res.statusCode = 500;
		res.render('error/500');
	}
});

//@desc    stories edit page
//@route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
	try {
		const story = await Story.findOne({ _id: req.params.id }).lean();
		if (!story) {
			return res.render('error/404');
		}
		if (story.user != req.user.id) {
			toast({
				appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
				title: 'Koya',
				message: 'You Are Not Creator Of The Story',
				icon: 'D:\\Desktop\\25231.png',
				attribution: 'Via Web',
			}).catch((err) => console.error(err));

			res.redirect('/stories');
		} else {
			res.render('stories/edit', {
				story,
			});
		}
	} catch (err) {
		console.error(err);
		res.redirect('/dashboard');
	}
});

//@desc    process edit information
//@route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
	try {
		let story = await Story.findById(req.params.id).lean();
		if (!story) {
			return res.render('error/404');
		}
		if (story.user != req.user.id) {
			toast({
				appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
				title: 'Koya',
				message: 'You Are Not Creator Of The Story',
				icon: 'D:\\Desktop\\25231.png',
				attribution: 'Via Web',
			}).catch((err) => console.error(err));
			res.redirect('/stories');
		} else {
			story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
				new: true, //if not existing then create one
				runValidators: true, //to make sure that the fields are valid
			});
			const toasty = toast({
				appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
				title: 'Koya',
				message: 'Story Updated',
				icon: 'D:\\Desktop\\25231.png',
				attribution: 'Via Web',
			}).catch((err) => console.error(err));

			if (toasty) {
				res.redirect('/dashboard');
			}
		}
	} catch (err) {
		console.error(err);
		res.redirect('/dashboard');
	}
});

//@desc    delete stories
//@route   DELETE /stories/id
router.delete('/:id', ensureAuth, async (req, res) => {
	try {
		await Story.remove({ _id: req.params.id });
		const toasty = toast({
			appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
			title: 'Koya',
			message: 'Story Deleted',
			icon: 'D:\\Desktop\\25231.png',
			attribution: 'Via Web',
		}).catch((err) => console.error(err));

		if (toasty) {
			res.redirect('/dashboard');
		}
	} catch (err) {
		console.error(err);
		res.redirect('/dashboard');
	}
});

//Populate will automatically replace the specified path in the document, with document(s) from other collection(s)
//@desc    show story
//@route   GET /stories/id
router.get('/:id', ensureAuth, async (req, res) => {
	try {
		let story = await Story.findById(req.params.id).populate('user').lean();

		if (!story) {
			return res.render('error/404');
		}

		res.render('stories/show', {
			story,
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 404;
		res.render('error/404');
	}
});
// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({
			user: req.params.userId,
			status: 'public',
		})
			.populate('user')
			.lean();

		toast({
			appID: 'com.squirrel.GitHubDesktop.GitHubDesktop',
			title: 'Koya',
			message: `Stories By ` + stories[0].user.displayName,
			icon: 'D:\\Desktop\\25231.png',
			attribution: 'Via Web',
		}).catch((err) => console.error(err));
		res.render('stories/index', {
			stories,
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.render('error/500');
	}
});
module.exports = router;
