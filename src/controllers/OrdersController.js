// const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');
const {ensureAuthorization} = require('../modules/authorizationJWT');
require('dotenv').config();

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true 
    }); 

    const [authorizedUser, err] = ensureAuthorization(req);
    if (err) return res.status(StatusCodes.BAD_REQUEST).json(err);

    const {items, delivery, firstBookTitle, totalQuantity, totalPrice} = req.body;

    // INSERT delivery
    let sql = process.env.INSERT_DELIVERY;
    let values = [delivery.address, delivery.receiver, delivery.contact]; 
    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;

    // INSERT orders
    sql = process.env.INSERT_ORDERS; 
    values = [firstBookTitle, totalQuantity, totalPrice, authorizedUser.id, delivery_id];
    [results] = await conn.execute(sql, values);
    let order_id = results.insertId;

    // SELECT book_id, quantity FROM cartItems WHERE IN [1, 2, 3];
    sql = process.env.SELECT_CART_ITEMS_USER;
    let [orderItems, fields] = await conn.query(sql, [items]);

    // INSERT orderedBook
    sql = process.env.INSERT_ORDERED_BOOK;
    values = [];
    orderItems.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });
    [results] = await conn.query(sql, [values]);

    // DELETE cartItems
    results = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(results);
};

const deleteCartItems = async (conn, items) => {
    let sql = process.env.DELETE_CART_ITEMS;

    return await conn.query(sql, [items]);
}

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true 
    });
    
    const [authorizedUser, err] = ensureAuthorization(req);
    if (err) return res.status(StatusCodes.BAD_REQUEST).json(err);

    let sql = process.env.SELECT_ORDERS;

    let [rows, fields] = await conn.query(sql, authorizedUser.id);

    return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
    const [authorizedUser, err] = ensureAuthorization(req);
    if (err) return res.status(StatusCodes.BAD_REQUEST).json(err);
    const orderId = req.params.id;

    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true 
    });

    let sql = process.env.SELECT_ORDERS_DETAIL;
    let [rows, fields] = await conn.query(sql, [orderId]);
    
    return res.status(StatusCodes.OK).json(rows);
};

module.exports = {order, getOrders, getOrderDetail};
