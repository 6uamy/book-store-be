var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const  ensureAuthorization = (req) => {
    let jwtToken = req.headers['authorization'];
    
    return jwt.verify(jwtToken, process.env.PRIVATE_KEY);
}

module.exports = {ensureAuthorization};
