const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

app.listen(process.env.PORT);

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const categorysRouter = require('./routes/category');
const cartsRouter = require('./routes/carts');
const likesRouter = require('./routes/likes');
const ordersRouter = require('./routes/orders');

app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/category', categorysRouter);
app.use('/carts', cartsRouter);
app.use('/likes', likesRouter);
app.use('/orders', ordersRouter);
