process.env.NODE_ENV = 'test';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const ev = require('express-validation');
const errorHandler = require('../../errors').handler;
const errorCodes = require('../../errors/code');


chai.should();
chai.use(sinonChai);

describe(
    'Test error handlers',
    () => {
        it('Testing with httpError with unkonwn error', (done) => {
            const dummyRequest = {};
            const dummyResponse = {
                status: () => true,
                json: () => true,
            };
            const spyResponse = sinon.spy(dummyResponse, 'status');
            errorHandler.httpError()({}, dummyRequest, dummyResponse);
            spyResponse.should.have.been.calledWith(500);
            done();
        });
        it('Testing with httpError with empty validation error', (done) => {
            const dummyRequest = {};
            const dummyResponse = {
                status: () => true,
                json: () => true,
            };
            const validationError = new ev.ValidationError([], {
                status: 400,
                statusText: errorCodes.INVALID_INPUT,
            });
            const spyResponse = sinon.spy(dummyResponse, 'status');
            errorHandler.httpError()(validationError, dummyRequest, dummyResponse);
            spyResponse.should.have.been.calledWith(400);
            done();
        });
        it('Testing with httpError with unkonwn error on development environment', (done) => {
            const dummyRequest = {
                app: {
                    get: () => 'development',
                },
            };
            const dummyResponse = {
                status: () => true,
                json: () => true,
            };
            const spyResponse = sinon.spy(dummyResponse, 'status');
            errorHandler.httpError()(new Error(), dummyRequest, dummyResponse);
            spyResponse.should.have.been.calledWith(500);
            done();
        });
        it('Testing with httpError with syntax error on development environment', (done) => {
            const dummyRequest = {
                app: {
                    get: () => 'development',
                },
            };
            const dummyResponse = {
                status: () => true,
                json: () => true,
            };
            const spyResponse = sinon.spy(dummyResponse, 'status');
            errorHandler.httpError()(new SyntaxError(), dummyRequest, dummyResponse);
            spyResponse.should.have.been.calledWith(500);
            done();
        });
    },
);
