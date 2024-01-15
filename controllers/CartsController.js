const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const {ensureAuthorization, checkJWT} = require('../modules/authorizationJWT');
require('dotenv').config();

const addCartsItem = (req, res) => {
    const {book_id, quantity} = req.body;
    const authorizedUser = ensureAuthorization(req, res);
    checkJWT(authorizedUser, res);
    
    const sql = process.env.ADD_CARTS_ITEM;
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

    let sql = process.env.SELECT_CARTS_ITEM;

    const values = [authorizedUser.id];
    if (selected) {
        sql += process.env.SELECTED_CARTS_ITEM;
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

    const sql = process.env.DELETE_CARTS_ITEM;
    conn.query(sql, cartItemId, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.OK).json(results);
    });
};

module.exports = {addCartsItem, selectCartsItem, removeCartsItem};
