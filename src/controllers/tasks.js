const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tasks',
    password: 'password',
    port: 5432,
});

const status = (request, response) => {
    const status = {
        'Status': 'Running'
    };

    response.send(status);
};

const postTask = async (req, res) => {

    const { title, dir, description } = req.body;

    console.log(req.body);

    if (!title || !dir || !description) {
        return res.status(400).send('One of the dir, or title, or description is missing in the data');
    }

    try {


        const querySequence = "select nextval('tasks_seq');";

        const newId = await pool.query(querySequence);

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
};

const getAllTasks = async (req, res) => {
    try {
        const query = 'SELECT * FROM tasks;';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

const getTasksPaginated = async (req, res) => {
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
};

const getTaskById = async (req, res) => {
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
};

const updateTask = async (req, res) => {
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
};

const taskDelete = async (req, res) => {
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
};


module.exports = {
    status,
    postTask,
    getAllTasks,
    getTaskById,
    getTasksPaginated,
    updateTask,
    taskDelete
}
