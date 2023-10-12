'use-strict';

const { expect } = require('chai');

const rewire = require('rewire');
const HttpError = require('standard-http-error');
const tokenUtil = require('../../helpers/token-util.js');

const tokenUtilPrivate = rewire('../../helpers/token-util.js');

describe('Token utility helper', () => {
    describe('parseToken method', () => {
        it('returns bearer or basic token from given string', () => {
            const test = tokenUtilPrivate.__get__('parseToken("Bearer 74c65c3c-d63d-3fa0-959c-9f687d85d63d")');
            expect(test).to.equal('Bearer 74c65c3c-d63d-3fa0-959c-9f687d85d63d');
        });
        it('throws an erorr with status code 422 if incorrect token is passed', () => {
            try {
                tokenUtilPrivate.__get__('parseToken("74c65c3c-d63d-3fa0-959c-9f687d85d63d")');
            } catch (error) {
                error.should.be.an('object');
                error.should.be.an.instanceOf(HttpError).with.property('stack', 'Incorrect token.');
                error.should.be.an.instanceOf(HttpError).with.property('statusCode', 422);
                error.should.be.an.instanceOf(HttpError).with.property('statusMessage', 'Unprocessable entity.');
            }
        });
    });

    describe('getAuthorizationTokenFromRequest', () => {
        it('returns bearer token from request authorization header', () => {
            const request = {
                headers: {
                    authorization: 'Bearer 74c65c3c-d63d-3fa0-959c-9f687d85d63d',
                },
            };
            const token = tokenUtil.getAuthorizationTokenFromRequest(request);
            expect(token).to.equal('Bearer 74c65c3c-d63d-3fa0-959c-9f687d85d63d');
        });

        it('throws an erorr with status code 422 if no header is passed in request', () => {
            try {
                const request = {};
                tokenUtil.getAuthorizationTokenFromRequest(request);
            } catch (error) {
                error.should.be.an('object');
                error.should.be.an.instanceOf(HttpError).with.property('stack', 'Authorization header is required.');
                error.should.be.an.instanceOf(HttpError).with.property('statusCode', 422);
                error.should.be.an.instanceOf(HttpError).with.property('statusMessage', 'Unprocessable entity.');
            }
        });
        it('throws an erorr with status code 422 if authorization header is not passed in request', () => {
            try {
                const request = {
                    headers: {
                    },
                };
                tokenUtil.getAuthorizationTokenFromRequest(request);
            } catch (error) {
                error.should.be.an('object');
                error.should.be.an.instanceOf(HttpError).with.property('stack', 'Authorization header is required.');
                error.should.be.an.instanceOf(HttpError).with.property('statusCode', 422);
                error.should.be.an.instanceOf(HttpError).with.property('statusMessage', 'Unprocessable entity.');
            }
        });
    });
});
