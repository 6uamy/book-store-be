const conn = require('../database/mariadb');
const {StatusCodes} = require('http-status-codes');
const {ensureAuthorization} = require('../modules/authorizationJWT');
require('dotenv').config();

const allBooks = (req, res) => {
    const {category_id, new_book, limit_books, current_page} = req.query;
    let allBooksRes = {};
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
        
        if (results.length) {
            
            allBooksRes.books = results;
        } else {
            res.status(StatusCodes.NOT_FOUND).end()
        };
    });

    sql = process.env.SELECT_FOUNT_TOTAL_COUNT;

    conn.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        let pagination = {};
        pagination.currentPage = +current_page;
        pagination.totalCount = results[0].total_count;

        allBooksRes.pagination = pagination;

        return res.status(StatusCodes.OK).json(allBooksRes);
    });
};

const bookDetail = (req, res) => {
    const book_id = req.params.id;
    const [authorizedUser, error] = ensureAuthorization(req);
    let sql = process.env.SELECT_BOOK_DETAIL_LOGIN;
    let values = [authorizedUser.id, book_id, book_id];
    
    if (error) {
        if (error.message === 'jwt must be provided') {
            sql = process.env.SELECT_BOOK_DETAIL_LOGOUT;
            values = [book_id];
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json(error);
        }   
    }
    
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        return results[0] ? res.status(StatusCodes.OK).json(results[0]) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = {allBooks, bookDetail};
