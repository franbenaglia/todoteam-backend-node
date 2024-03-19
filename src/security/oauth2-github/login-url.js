//https://medium.com/@jackrobertscott/easy-github-auth-with-node-js-502d3d8f8e62

const queryString =  require('query-string');
const {GITHUB_CLIENT_ID} = require('../constants.js');

const params = queryString.stringify({
  client_id: process.env.GITHUB_CLIENT_ID || GITHUB_CLIENT_ID,
  redirect_uri: 'http://localhost:4200',
  scope: ['read:user', 'user:email'].join(' '), 
  allow_signup: true,
});

const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;

module.exports = githubLoginUrl;