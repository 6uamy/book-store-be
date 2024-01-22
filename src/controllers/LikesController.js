require('dotenv').config();
const conn = require('../database/mariadb');
const {StatusCodes} = require('http-status-codes');
const {ensureAuthorization} = require('../modules/authorizationJWT');

const addLikes = (req, res) => {
    const {book_id} = req.params;
    const [authorizedUser, err] = ensureAuthorization(req, res);
    if (err) return res.status(StatusCodes.BAD_REQUEST).json(err);

    const sql = process.env.ADD_LIKES;
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
    const [authorizedUser, err] = ensureAuthorization(req, res);
    if (err) return res.status(StatusCodes.BAD_REQUEST).json(err);

    const sql = process.env.CANCEL_LIKES;
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
