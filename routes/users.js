const express = require('express');
const router = express.Router();

const usersConrtoller = require('../controllers/users_controller');
const passport = require('passport');

router.get('/profile/:id', passport.checkAuthentication, usersConrtoller.profile);
router.post('/profile/update/:id', passport.checkAuthentication, usersConrtoller.update);
router.post('/profile/delete-profile-pic', passport.checkAuthentication, usersConrtoller.deleteProfileImage)
router.get('/signin', usersConrtoller.signin);
router.get('/signup', usersConrtoller.signup);
router.post('/create-user', usersConrtoller.createUser);
router.post('/user-check', passport.authenticate('local',{ failureRedirect: '/users/signup' }), usersConrtoller.siginingIn);
router.post('/logout', usersConrtoller.logout);
router.get('/forgot-password', usersConrtoller.forgotPassword);
router.use('/reset-password', require('./reset-password'));

//FriendShip Router
router.use('/friendship', require('./friendship'));

//OAuth Routes
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signin'}), usersConrtoller.siginingIn)


module.exports = router;