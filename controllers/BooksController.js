const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
require('dotenv').config();

const allBooks = (req, res) => {
    const {category_id, new_book, limit_books, current_page} = req.query;
    let offset = limit_books * (current_page - 1);

    let sql = process.env.SELECT_ALL_BOOKS;
    let values = [Number(limit_books), offset];

    if (category_id && new_book) {
        values = [category_id, ...values];
        JSON.parse(new_book) === true ? sql += process.env.SELECT_CATEGORY_NEW_BOOKS : sql += process.env.SELECT_CATEGORY_BOOKS;
    } else if (category_id) {
        values = [category_id, ...values];
        sql += process.env.SELECT_CATEGORY_BOOKS;
    } else if (new_book) {
        if (JSON.parse(new_book) === true) sql += process.env.SELECT_NEW_BOOKS;
    }
    sql += process.env.SELECT_PAGE_BOOKS;

    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        results.length ? res.status(StatusCodes.OK).json(results) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

const bookDetail = (req, res) => {
    const {user_id} = req.body;
    const book_id = req.params.id;
    const sql = process.env.SELECT_BOOK_DETAIL;

    const values = [user_id, book_id, book_id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        results[0] ? res.status(StatusCodes.OK).json(results[0]) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = {allBooks, bookDetail};
