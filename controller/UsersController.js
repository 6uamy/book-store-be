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
    res.json('비밀번호 초기화 요청');
};

const passwordReset = (req, res) => {
    res.json('비밀번호 초기화');
};

module.exports = {join, login, passwordResetRequest, passwordReset};
