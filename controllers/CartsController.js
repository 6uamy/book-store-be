const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addCartsItem = (req, res) => {
    const {book_id, quantity, user_id} = req.body;

    const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    const values = [book_id, quantity, user_id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.CREATED).json(results);
    });
};

const selectCartsItem = (req, res) => {
    res.json('장바구니 목록 조회');
};

const removeCartsItem = (req, res) => {
    res.json('장바구니 삭제');
};

module.exports = {addCartsItem, selectCartsItem, removeCartsItem};
