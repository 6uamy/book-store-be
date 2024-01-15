const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const {ensureAuthorization, checkJWT} = require('../modules/authorizationJWT');

const addCartsItem = (req, res) => {
    const {book_id, quantity} = req.body;
    const authorizedUser = ensureAuthorization(req, res);
    checkJWT(authorizedUser, res);
    
    const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    const values = [book_id, quantity, authorizedUser.id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.CREATED).json(results);
    });

};

const selectCartsItem = (req, res) => {
    const {selected} = req.body;
    const authorizedUser = ensureAuthorization(req, res);
    checkJWT(authorizedUser, res);

    let sql = `SELECT C.id, C.book_id, B.title, B.summary, C.quantity, B.price 
    FROM cartItems AS C
    LEFT JOIN books AS B ON C.book_id = B.id 
    WHERE user_id = ?`;

    const values = [authorizedUser.id];
    if (selected) {
        sql +=` AND C.id IN (?)`;
        values.push(selected);
    }

    conn.query(sql, values, (err, results) => {
    if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

        return results.length ? res.status(StatusCodes.OK).json(results) : res.status(StatusCodes.NOT_FOUND).end();
    });
};

const removeCartsItem = (req, res) => {
    const cartItemId = req.params.id;

    const sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql, cartItemId, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.OK).json(results);
    });
};

module.exports = {addCartsItem, selectCartsItem, removeCartsItem};
