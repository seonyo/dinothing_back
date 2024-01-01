const db = require('../db/db');

const saltRequired = (req, res, next) => {
    const { userid, userpw } = req.body;
    db.query('SELECT SALT FROM user where userid = ?', [userid], (err, result) => {
        if (result.length === 1) {
            const salt = result[0].SALT.toString();
            req.salt = salt;
            next();
        } else {
            res.status(404).json({ message: "아이디가 일치하지 않음" })
        }
    })
};

module.exports = saltRequired;