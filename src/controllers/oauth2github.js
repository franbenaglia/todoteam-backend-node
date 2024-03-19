
const githubLoginUrl = require('../security/oauth2-github/login-url');
const getAccessTokenFromCode = require('../security/oauth2-github/access_token');

const getAuthCode = (request, response) => {
    response.status(200).json({ authURL: githubLoginUrl }); //would be authGithubURL
};

const getToken = async (request, response) => {

    const { code } = request.query;
    try {
        const tokenAccess = await getAccessTokenFromCode(code);
        response.json({ token: tokenAccess });
         //agregar send aqui genera error de ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client
    } catch (error) {
        console.log(error);
    }

};

module.exports = { getAuthCode, getToken };