require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    hashPassword: function(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    },
    generatePassword: function() {
        return crypto.randomBytes(6).toString('hex');
    },
    generateToken: function(user) {
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },
    verifyToken: function(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}
