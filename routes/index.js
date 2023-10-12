const express = require('express');

const router = express.Router();

router.use('/todo', require('./todo'));
router.use('/users', require('./users'));

module.exports = router;
