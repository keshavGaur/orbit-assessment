

process.env.NODE_ENV = 'test';

// const chai = require('chai');

// const should = chai.should();
const fs = require('fs');
require('it-each')({ testPerIteration: true });


const configFiles = fs.readdirSync('./config');
describe('Test config files...', () => {
    it.each(
        configFiles,
        '%s is names in proper form: [a-z_0-9]+.js',
        ['element'],
        (element, next) => {
            (/[a-z_0-9]+\.js/g).test(element).should.be.equal(true);
            next();
        },
    );
/**    it.each(
        configFiles,
        '%s exports modules etc./',
        ['element'],
        (element, next) => {
            if (element === 'default.js') {
                const exec = require(`../../config/${element}`);
                exec.should.be.an('object');
                should.exist(exec.api);
                exec.api.should.be.an('object');
                exec.api.ROOT_URI.should.be.a('string');
                exec.api.BASE_URI.should.be.an('object');
                exec.env.mode.should.be.a('string');
                exec.env.host.should.be.a('string');
                exec.env.port.should.be.an('number');
            } else {
                // any overridden properties added in config files needs to be asserted in here
            }
            next();
        },
    );
    */
});
