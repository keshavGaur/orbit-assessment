const express = require('express');

const router = express.Router();
const { todo } = require('../services');

router.get('/todoFromMSSQL', (req, res, next) => {
    todo.getTodoMSSQL()
        .then((data) => {
            res.send(data);
        })
        .catch(err => next(err));
});

/* GET todo listing. */
router.get('/todoFromMongoDB', (req, res, next) => {
    todo.getTodoMongoDB()
        .then((data) => {
            res.send(data);
        })
        .catch(err => next(err));
});


router.get('/todoFromRedis', (req, res, next) => {
    todo.getTodoRedis()
        .then((data) => {
            res.send(data);
        })
        .catch(err => next(err));
});

module.exports = router;
