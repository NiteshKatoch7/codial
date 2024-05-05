const express = require('express');

const router = express.Router();
const users_api = require('../../../controllers/api/v1/users_api');

router.post('/user-check', users_api.siginingIn);

module.exports = router;