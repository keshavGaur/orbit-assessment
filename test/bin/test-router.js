

process.env.NODE_ENV = 'test';

const chai = require('chai');
const http = require('http');

chai.should();
chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));
const router = require('../../bin/router');

const versionSchema = {
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

describe(
    'Test router.js',
    () => {
        const server = http.createServer(router());
        const request = chai.request(server);
        after(done => server.close(done));

        it(
            'GET /version should return version JSON',
            (done) => {
                request
                    .get('/version')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.jsonSchema(versionSchema);
                        done();
                    });
            },
        );
        it(
            'Unknown routes should return error',
            (done) => {
                request
                    .get('/UNKNOWN')
                    .end((err, res) => {
                        res.should.not.have.status(200);
                        done();
                    });
            },
        );
    },
);
