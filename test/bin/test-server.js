

process.env.NODE_ENV = 'test';

const chai = require('chai');
const server = require('../../bin/server.js');

const should = chai.should();

// chai.use(require('chai-http'));
// var http = require('http');
// chai.use(require('chai-json-schema'));


describe(
    'Test server.js',
    () => {
        // const server = http.createServer(require('../../bin/router'))
        // const request = chai.request(server);
        // after((done) => server.close(done));

        it(
            'Test normalizePort...',
            (done) => {
                server.normalizePort('string').should.be.a('string');
                server.normalizePort(100).should.be.a('number');
                server.normalizePort(-100).should.be.equal(false);
                done();
            },
        );
        it(
            'Test createServer...',
            (done) => {
                const test = server.createServer();
                test.should.be.an('object');
                test.close();
                done();
            },
        );
        it(
            'Test createRouter',
            (done) => {
                const test = server.createRouter();
                should.exist(test);
                done();
            },
        );
        it(
            'Test serverListenHandler',
            (done) => {
                const test = server.serverListenHandler();
                should.not.exist(test);
                done();
            },
        );
        it(
            'Test serverErrorHandler',
            (done) => {
                (function anonymous() {
                    server.serverErrorHandler(new Error());
                }).should.throw();
                let error = new Error();
                error.code = 'EACCES';
                error.message = 'test';
                let test = server.serverErrorHandler(error);
                should.not.exist(test);
                error = new Error();
                error.code = 'EADDRINUSE';
                error.message = 'test';
                test = server.serverErrorHandler(error);
                should.not.exist(test);
                done();
            },
        );
        it(
            'Test startServer',
            (done) => {
                const test = server.startServer(3000);
                test.should.be.an('object');
                test.close();
                done();
            },
        );
        it(
            'Test main',
            (done) => {
                const test = server.main();
                test.should.be.an('object');
                test.close();
                done();
            },
        );
    },
);
