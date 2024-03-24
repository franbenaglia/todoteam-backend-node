const express = require('express');
const cors = require('cors');
const registerLogin = require('./registerLogin.js');

const client = require('./eureka/eureka-client.js');

const {PORT}= require('./constants.js');

const app = express();

const whitelist = ['http://localhost:4200', 'http://localhost:8500'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(express.json());

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log('server is listening on port '+PORT);
});

app.use('/auth', registerLogin);

client.start((error) => {
    console.log(error || 'complete');
});

client.logger.level('debug');