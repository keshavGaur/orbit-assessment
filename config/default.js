// API server default configuration
// Sensitive information will be read from process
module.exports = {
    db: {
        pg: {
            user: "postgres",
            host: "localhost",
            database: "orbit",
            password: "root",
            port: 5432,
        },
    },
};
