var express = require('express');
var router = express.Router();
var jwt     = require('jsonwebtoken');
var app = express();
var secret = require('../config').secret;

var login = require('./Login');
var daylist = require('./DayList');
var register = require('./Register');
var workoutlist = require('./WorkoutList');
var macro = require('./Macro');
var graph = require('./Graph');
var imag = require('./Image');
var goal = require('./Goal');

router.use(login);
router.use(register);

router.use(function(req, res, next) {
	var token = req.get('x-access-token');
	if (token) {
		jwt.verify(token, secret, function(err, decoded) {			
			if (err) {
				console.log(err);
				return res.json({ success: false, token: false, message: 'You have been logged out of Fitsyque. Please login.' });		
			} else {
				req.decoded = decoded;
				next();
			}
		});
		
	} else {
		return res.json({ 
			success: false, 
			token: false,
			message: 'Failed to authenticate your account. Please login.'
		});
	}
});

router.use(daylist);
router.use(workoutlist);
router.use(macro);
router.use(graph);
router.use(imag);
router.use(goal);

module.exports = router;
