const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {body, param, validationResult} = require('express-validator');
const {StatusCodes} = require('http-status-codes');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(err.array());
    }
}

// 회원 가입
router.post('/join', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일 입력'),
        body('password').notEmpty().isString().withMessage('비밀번호 입력'),
        validate
    ], 
    (req, res) => {
        const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
        const {email, password} = req.body;
        const values = [email, password];

        conn.query(sql, values, (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.CREATED).json(results);
        });
    }
);

// 로그인
router.post('/login', (req, res) => {
    res.json('로그인');
});

router
    .route('/reset')
    // 비밀번호 초기화 요청
    .post((req, res) => {
        res.json('비밀번호 초기화 요청');
    })
    // 비밀번호 초기화
    .put((req, res) => {
        res.json('비밀번호 초기화');
    });

module.exports = router;
