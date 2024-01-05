const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addLikes = (req, res) => {
    const {book_id} = req.params;
    const {user_id} = req.body;

    const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [user_id, book_id];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.CREATED).json(results);
    });
}

const cancelLikes = (req, res) => {
    res.json('좋아요 취소');
}

module.exports = {addLikes, cancelLikes};
