const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) => {
    const {category_id} = req.query;

    if (category_id) {
        const sql = `SELECT * FROM books WHERE category_id = ?`;
        conn.query(sql, category_id, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            results.length ? res.status(StatusCodes.OK).json(results) : res.status(StatusCodes.NOT_FOUND).end();
        });
    } else {
        const sql = `SELECT * FROM books`;
        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            return res.status(StatusCodes.OK).json(results);
        });
    }
};

const bookDetail = (req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM books WHERE id = ?`;
    conn.query(sql, id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        results[0] ? res.status(StatusCodes.OK).json(results[0]) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

module.exports = {allBooks, bookDetail};
