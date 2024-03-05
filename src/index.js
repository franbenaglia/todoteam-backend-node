const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());


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

app.use(cors(corsOptions));



const PORT = process.env.PORT || 8080;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tasks',
    password: 'password',
    port: 5432,
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get('/status', (request, response) => {
    const status = {
        'Status': 'Running'
    };

    response.send(status);
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


app.post('/api/task/task', async (req, res) => {

    const { title, dir, description } = req.body;

    console.log(req.body);

    if (!title || !dir || !description) {
        return res.status(400).send('One of the dir, or title, or description is missing in the data');
    }

    try {


        const querySequence = "select nextval('tasks_seq');";

        const  newId = await pool.query(querySequence);

        const query = `
       INSERT INTO tasks (title, dir, description,id)
       VALUES ($1, $2, $3, $4)
       RETURNING id;
     `;
        const values = [title, dir, description, newId.rows[0].nextval];

        const result = await pool.query(query, values);
        res.status(201).send({ message: 'New Task created', taskId: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).send('some error has occured');
    }
});

app.get('/api/task/tasks', async (req, res) => {
    try {
        const query = 'SELECT * FROM tasks;';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
});

app.get('/api/task/tasks/:pageNumber/:pageSize', async (req, res) => {
    try {
        const { pageNumber, pageSize } = req.params;
        const offset = (pageNumber * pageSize) + 1;
        const query = 'SELECT * FROM tasks ORDER BY id LIMIT '
            + pageSize + ' OFFSET ' + offset + ';';
        const queryT = 'SELECT * FROM tasks;';
        const { rows } = await pool.query(query);
        const rowsc = await pool.query(queryT);
        const taskResponse = { tasks: rows, totalRecords: rowsc.rowCount };
        res.status(200).json(taskResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
});

app.get('/api/task/task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM tasks WHERE id = $1;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send('this task is not in the database');
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
});

app.put('/api/task/task', async (req, res) => {
    try {
        //const { id } = req.params;
        const { id, title, dir, description } = req.body;

        if (!title && !dir && !description) {
            return res.status(400).send('provide a field (title, dir, or description)');
        }

        const query = `
       UPDATE tasks
       SET title = COALESCE($1, title),
           dir = COALESCE($2, dir),
           description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *;
     `;
        const { rows } = await pool.query(query, [title, dir, description, id]);

        if (rows.length === 0) {
            return res.status(404).send('Cannot find anything');
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Some error has occured failed');
    }
});

app.delete('/api/task/task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send('we have not found the task');
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('some error has occured');
    }
});



