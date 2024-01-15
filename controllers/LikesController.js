const dotenv = require('dotenv').config();
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const {ensureAuthorization} = require('../modules/authorizationJWT');

const addLikes = (req, res) => {
    const {book_id} = req.params;
    const authorizedUser = ensureAuthorization(req);

    const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [authorizedUser.id, book_id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.CREATED).json(results);
    });
}

const cancelLikes = (req, res) => {
    const {book_id} = req.params;
    const authorizedUser = ensureAuthorization(req);

    const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
    const values = [authorizedUser.id, book_id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.OK).json(results);
    });
}

module.exports = {addLikes, cancelLikes};
