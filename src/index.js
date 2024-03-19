const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const formData = require("express-form-data");
const os = require("os");

const tasks_routes = require('./routes/tasks.js');
const oauth2_google_routes = require('./routes/oauth2google.js');
const oauth2_github_routes = require('./routes/oauth2github.js');
const PORT = process.env.PORT || 8080;

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

const options = {
    uploadDir: __dirname+'/images',
    autoClean: true
  };
  
  // parse data with connect-multiparty. 
  app.use(formData.parse(options));
  // delete from the request all empty files (size == 0)
  app.use(formData.format());
  // change the file objects to fs.ReadStream 
  //app.use(formData.stream());
  // union the body and the files
  app.use(formData.union());


app.listen(PORT, () => {
    console.log('server is listening on port 8080');
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tasks',
    password: 'password',
    port: 5432,
});

async function createTasksTable() {
    try {
        const query = `
       CREATE TABLE IF NOT EXISTS tasks (
         id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         dir VARCHAR(255) NOT NULL,
         description VARCHAR(255)
       );
     `;

        await pool.query(query);
        console.log('Tasks table created');
    } catch (err) {
        console.error(err);
        console.error('Tasks table creation failed');
    }
}

//createTasksTable();

app.use('/api/task', tasks_routes);
app.use('/auth/github', oauth2_github_routes);
app.use('/auth', oauth2_google_routes);



