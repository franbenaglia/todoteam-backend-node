
const googleLoginUrl = require('../security/oauth2-google/login-url');
const getAccessTokenFromCode = require('../security/oauth2-google/access_token');

const getAuthCode = (request, response) => {
    response.status(200).json({ authURL: googleLoginUrl });
};

const getToken = (request, response) => {
   
    const { code } = request.params;
    let tokenAccess = getAccessTokenFromCode(code);
    response.send(200).json({ token: tokenAccess } );
};

module.exports = { getAuthCode, getToken };