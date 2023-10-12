

process.env.NODE_ENV = 'test';

const chai = require('chai');

// const should = chai.should();

chai.use(require('chai-http'));
const http = require('http');
chai.use(require('chai-json-schema'));
const config = require('config');
const router = require('../../bin/router');


const baseUri = config.get('api.BASE_URI');

/**
 * const versionSchema = {
    title: 'version schema',
    type: 'object',
    required: ['name', 'version'],
    properties: {
        name: {
            type: 'string',
        },
        version: {
            type: 'string',
        },
    },
};
*/

describe(
    'Test users routes',
    () => {
        const server = http.createServer(router());
        const request = chai.request(server);
        after(done => server.close(done));

        it(
            'GET /users should return something',
            (done) => {
                request
                    .get(`${baseUri}users`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            },
        );
    },
);
