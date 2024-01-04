const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) => {
    const {category_id, new_book} = req.query;
    let sql = `SELECT * FROM books`;
    let values = [];

    if (category_id && new_book) {
        values = [category_id, new_book];
        JSON.parse(new_book) === true ? sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()` : sql += ` WHERE category_id = ?`;
    } else if (category_id) {
        values = category_id;
        sql += ` WHERE category_id = ?`;
    } else if (new_book) {
        values = new_book;
        if (JSON.parse(new_book) === true) sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        results.length ? res.status(StatusCodes.OK).json(results) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

const bookDetail = (req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;
    conn.query(sql, id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        results[0] ? res.status(StatusCodes.OK).json(results[0]) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = {allBooks, bookDetail};
