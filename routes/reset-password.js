const express = require('express');
const router = express.Router();
const usersConrtoller = require('../controllers/users_controller');

router.post('/confirm-email', usersConrtoller.resetPasswordConfirmEmail);
router.get('/:auth', usersConrtoller.resetPassword);
router.post('/change-password/:auth', usersConrtoller.changePassword);

module.exports = router;