const express = require('express');
const router = express.Router();
const verifyToken = require('../security/auth');

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

router.post('/task', verifyToken, postTask);

router.get('/tasks', verifyToken, getAllTasks);

router.get('/task/:id', verifyToken, getTaskById);

router.get('/tasks/:pageNumber/:pageSize', verifyToken, getTasksPaginated);

router.put('/task', verifyToken, updateTask);

router.delete('/task/:id', verifyToken, taskDelete);

module.exports = router;
