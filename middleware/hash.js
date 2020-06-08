const crypto = require('crypto');

module.exports = (text) => {
    const hashed = crypto.pbkdf2Sync(text, "debugkey", 100000, 64, 'sha512');
    return hashed.toString('hex');
};