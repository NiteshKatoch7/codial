const express = require('express');

const router = express.Router();
const posts_api = require('../../../controllers/api/v1/posts_api');
const passport = require('passport');

router.get('/', posts_api.index);
router.delete('/:id', passport.authenticate('jwt', { session: false }), posts_api.delete);

module.exports = router;

//  client-id: 963044942365-uagolr72l1edfbl733e1c0hhr99bodr1.apps.googleusercontent.com
// client-secret: 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