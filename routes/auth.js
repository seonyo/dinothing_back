const router = require('express').Router();
const crypto = require('crypto');
const session = require('express-session');
const db = require('../db/db');

const maxAge = 1000 * 60 * 5;

const sessionObj = {
    secret: process.env.SESSION_ID,
    resave: false,
    saveUninitialized: true,
    maxAge: 1000 * 60 * 5
};

router.use(session(sessionObj));

//salt의 정보를 가져오는 미들웨어
router.post('/login', (req, res, next) => {
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
})

router.get('/check-login', (req, res) => {
    console.log(req.session.dinothingid)
    if (!req.session.dinothingid) {
        res.json({message : false});
    }else {
        res.json({message : true});
    }
})

router.get('/user', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'get/user에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get('/user/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM user where id = ?', id, (err, results) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ message: 'get/user:id에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    })
});

router.post('/user', (req, res) => {
    const { name, userid, userpw } = req.body;
    const salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2(userpw, salt, 9234, 64, "sha512", (err, key) => {
        if (err) {
            console.log(err);
            return;
        } else {
            db.query('INSERT into user (name, userid, userpw, SALT) VALUES (?,?,?,?)', [name, userid, key, salt], (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ message: 'post/user에서 오류 발생' });
                } else {
                    return res.status(200).json(results);
                }
            });
        }
    })
});

router.post('/login', (req, res) => {
    const { userid, userpw } = req.body;
    const salt = req.salt;
    crypto.pbkdf2(userpw, salt, 9234, 64, "sha512", (err, key) => {
        if (err) {
            console.log(err);
            return;
        } else {
            db.query('SELECT userid, userpw from user where userid = ? AND userpw = ?', [userid, key], (err, result) => {
                if (result.length === 1) {
                    res.status(200).json(result);
                    if (!req.session.dinothingid) {
                        // 세션이 아직 생성되지 않았다면 세션 생성
                        req.session.dinothingid = userid;
                        console.log("세션 생성:", req.session.dinothingid);
                    } else {
                        console.log("이미 세션이 존재합니다:", req.session.dinothingid);
                    }    
                } else {
                    res.status(404).json({ message: '아이디나 비밀번호가 옳지 않음' })
                }
            })
        }
    })
});

module.exports = router;