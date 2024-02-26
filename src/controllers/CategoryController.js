const conn = require('../database/mariadb');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const allCategory = (req, res) => {
    const sql = process.env.SELECT_CATEGORY;
    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        results.length
            ? res.status(StatusCodes.OK).json(results)
            : res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = { allCategory };
