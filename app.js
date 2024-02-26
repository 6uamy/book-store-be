const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

app.listen(process.env.PORT);

const usersRouter = require('./src/routes/users');
const booksRouter = require('./src/routes/books');
const categorysRouter = require('./src/routes/category');
const cartsRouter = require('./src/routes/carts');
const likesRouter = require('./src/routes/likes');
const ordersRouter = require('./src/routes/orders');

app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/category', categorysRouter);
app.use('/carts', cartsRouter);
app.use('/likes', likesRouter);
app.use('/orders', ordersRouter);
