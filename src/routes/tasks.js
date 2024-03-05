const express = require('express');
const router = express.Router();

const {
    status,
    postTask,
    getAllTasks,
    getTaskById,
    getTasksPaginated,
    updateTask,
    taskDelete
} = require('../controllers/tasks.js');

router.get('/', status);

router.post('/task', postTask);

router.get('/tasks', getAllTasks);

router.get('/task/:id', getTaskById);

router.get('/tasks/:pageNumber/:pageSize', getTasksPaginated);

router.put('/task', updateTask);

router.delete('/task/:id', taskDelete);

module.exports = router;
