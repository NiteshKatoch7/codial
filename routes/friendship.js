const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');

router.get('/add-friend', friendshipController.addFriend);

module.exports = router;