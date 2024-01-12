//const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true 
    });

    const {items, delivery, firstBookTitle, totalQuantity, totalPrice, userId} = req.body;

    // INSERT delivery
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
    let values = [delivery.address, delivery.receiver, delivery.contact]; 
    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;

    // INSERT orders
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
    VALUES (?, ?, ?, ?, ?)`; 
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await conn.execute(sql, values);
    let order_id = results.insertId;

    // INSERT orderedBook
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`
    values = [];
    items.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });
    [results] = await conn.query(sql, [values]);
    return res.status(StatusCodes.OK).json(results);
};

const getOrders = (req, res) => {
    res.json('주문 내역 조회');
};

const getOrderDetail = (req, res) => {
    res.json('주문 내역 상품 상세 조회');
};

module.exports = {order, getOrders, getOrderDetail};
