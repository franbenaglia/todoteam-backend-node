const express = require('express');
const router = express.Router();

const {

    getAuthCode,
    getToken

} = require('../controllers/oauth2github.js');

router.get('/url', getAuthCode);

router.get('/callback', getToken); 

module.exports = router;