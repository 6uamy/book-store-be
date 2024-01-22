const conn = require('../database/mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv').config();

const join = (req, res) => {
    const {email, password} = req.body;

    // 비밀번호 암호화
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = encryptionPassword(password, salt);

    const sql = process.env.JOIN;
    const values = [email, hashPassword, salt];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.CREATED).json(results);
    });
};

const login = (req, res) => {
    const {email, password} = req.body;

    const sql = process.env.LOGIN;
    conn.query(sql, email, (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];
            
            const salt = loginUser ? loginUser.salt : '';
            const hashPassword = encryptionPassword(password, salt);
            if (loginUser && loginUser.password === hashPassword) {
                // 토큰 발급
                const token = jwt.sign({ 
                    id: loginUser.id,
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

    const sql = process.env.REQUEST_PASSWORD_RESET;
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

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = encryptionPassword(password, salt);

    const sql = process.env.PASSWORD_RESET;
    let values = [hashPassword, salt, email];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        results.affectedRows === 0 ? res.status(StatusCodes.BAD_REQUEST).end() : res.status(StatusCodes.OK).json(results);
    });
};

function encryptionPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
}

module.exports = {join, login, passwordResetRequest, passwordReset};
