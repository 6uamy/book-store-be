// get the client
const mariadb = require('mysql2/promise');

// create the connection to database
const connection = async () => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true 
    });

    return conn;
}

module.exports = connection;
