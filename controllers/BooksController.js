const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) => {
    const {category_id, new_book, limit_books, current_page} = req.query;
    let offset = limit_books * (current_page - 1);

    let sql = `SELECT * FROM books`;
    let values = [Number(limit_books), offset];

    if (category_id && new_book) {
        values = [category_id, ...values];
        JSON.parse(new_book) === true ? sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()` : sql += ` WHERE category_id = ?`;
    } else if (category_id) {
        values = [category_id, ...values];
        sql += ` WHERE category_id = ?`;
    } else if (new_book) {
        if (JSON.parse(new_book) === true) sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }
    sql += ` LIMIT ? OFFSET ?`;

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
