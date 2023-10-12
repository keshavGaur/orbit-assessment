const express = require('express');
const validate = require('express-validation');
const HttpError = require('standard-http-error');

const router = express.Router();
const HttpStatusCode = { ...HttpError };
const logger = require('./../logger');

/**
 * @swagger
 * definition:
 *   user:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/user'
 */

router.get('/', (req, res, next) => {
    logger.debug('here: In get users');
    try {
        const users = {
            users: [{
                name: 'Keshav',
                email: 'keshav@infoedge.com',
            },
            {
                name: 'ankit pareek',
                email: 'ankit.pareek.@infoedge.com',
            }],
        };
        logger.debug('here: Got users', users);
        logger.info('Got users:');
        res.send(users);
    } catch (e) {
        logger.error(e);
        next(new HttpError(HttpStatusCode.INTERNAL_SERVER_ERROR, { stack: e }));
    }
});

/**
 * @swagger
 * /users/fake-error:
 *   get:
 *     tags:
 *       - users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/user'
 */
router.get('/fake-error', (req, res, next) => {
    logger.debug('here: In fake-error');
    try {
        throw new Error('ohhhh boi');
    } catch (e) {
        logger.error(e);
        next(new HttpError(HttpStatusCode.INTERNAL_SERVER_ERROR, { stack: e }));
    }
});

router.post('/validate', validate(require('../validators/username')), (req, res, next) => {
    res.status(200).json({ username: req.body.username });
});

module.exports = router;
