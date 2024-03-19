const express = require('express');
const router = express.Router();

const {

    getAuthCode,
    getToken

} = require('../controllers/oauth2google.js');

router.get('/url', getAuthCode);

router.get('/callback', getToken);
module.exports = router;