const { StatusCodes } = require('http-status-codes');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

const ensureAuthorization = (req, res) => {    
    try {
        let jwtToken = req.headers['authorization'];

        return jwt.verify(jwtToken, process.env.PRIVATE_KEY);
    } catch (err) {
        return err;
    }
}

const checkJWT = (authorizedUser, res) => {
    if (authorizedUser instanceof TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다."
        });
    } 
    
    if (authorizedUser instanceof JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "토큰 형식이 잘못되었습니다."
        });
    }
}

module.exports = {ensureAuthorization, checkJWT};
