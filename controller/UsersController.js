const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const join = (req, res) => {
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const {email, password} = req.body;
    const values = [email, password];

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.CREATED).json(results);
    });
};

const login = (req, res) => {
    const {email, password} = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];
            if (loginUser && loginUser.password === password) {
                // 토큰 발급
                const token = jwt.sign({ 
                    email: loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '5m',
                    issuer: 'taek'
                });

                res.cookie('token', token, {
                    httpOnly: true
                });
                console.log(token);

                return res.status(StatusCodes.OK).json({
                    message: `${loginUser.email}님 로그인에 성공하셨습니다.`
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: '아이디 또는 비밀번호가 틀렸습니다.'
                });
            }
        }
    );
};

const passwordResetRequest = (req, res) => {
    const {email} = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const user = results[0];
        user ? res.status(StatusCodes.OK).json({email : email}) : res.status(StatusCodes.UNAUTHORIZED).end();
    });
};

const passwordReset = (req, res) => {
    const {email, password} = req.body;

    const sql = `UPDATE users SET password = ? WHERE email = ?`;
    let values = [password, email];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.OK).json(results);
    });
};

module.exports = {join, login, passwordResetRequest, passwordReset};
