const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const join = (req, res) => {
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const {email, password} = req.body;
    const values = [email, password];

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.CREATED).json(results);
    });
}

module.exports = join;
