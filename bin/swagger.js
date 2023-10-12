
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');

/** Load the swagger configuration
 * @returns {Function} Function which loads swagger configuration is returned
 */
function load() {
    // catch 404 and forward to error handler
    return (req, res) => {
        const options = {
            swaggerDefinition: config.get('swagger'),
            apis: ['./routes/**/*.js'], // Path to the API docs
        };

        const swaggerSpec = swaggerJSDoc(options);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(swaggerSpec);
    };
}

module.exports = {
    load,
};
