var jwt = require('jsonwebtoken');
require('dotenv').config();

const ensureAuthorization = (req, res) => {    
    try {
        let jwtToken = req.headers['authorization'];

        return [jwt.verify(jwtToken, process.env.PRIVATE_KEY), 0];
    } catch (err) {
        return [0, err];
    }
}

module.exports = {ensureAuthorization};
