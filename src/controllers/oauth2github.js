
const githubLoginUrl = require('../security/oauth2-github/login-url');
const getAccessTokenFromCode = require('../security/oauth2-github/access_token');

const getAuthCode = (request, response) => {
    response.status(200).json({ authURL: githubLoginUrl }); //would be authGithubURL
};

const getToken = (request, response) => {
   
    const { code } = request.params;
    let tokenAccess = getAccessTokenFromCode(code);
    response.send(200).json({ token: tokenAccess } );
};

module.exports = { getAuthCode, getToken };