const express = require('express');
const cors = require('cors');
const registerLogin = require('./registerLogin.js');

const PORT = process.env.PORT_SECURITY_SERVER || 8081;

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
    console.log('server is listening on port 8081');
});

app.use('/auth', registerLogin);