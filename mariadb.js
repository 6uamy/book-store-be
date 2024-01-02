// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Bookshop',
  timezone: '+00:00',
  dateStrings: true 
});

module.exports = connection;
