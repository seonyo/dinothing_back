const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const mysql = require('mysql2');

const port = 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '990327',
    database: 'dinothing'
});

//db 연결 여부
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
    } else {
        console.log('Database connected successfully');
    }
});

//salt의 정보를 가져오는 미들웨어
app.post('/login', (req, res, next)=>{
    const {userid, userpw} = req.body;
    db.query('SELECT SALT FROM user where userid = ?', [userid], (err, result) => {
        if(err){
            console.log(err.message)
        } else {
            const salt = result[0].SALT.toString();
            req.salt = salt;
            next();
        }
    })
})

app.get('/user', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'get/user에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/user/:id', (req, res) => {
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

app.post('/user', (req, res) => {
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

app.post('/login', (req, res) => {
    const {userid, userpw} = req.body;
    const salt = req.salt;

    crypto.pbkdf2(userpw, salt, 9234, 64, "sha512", (err, key)=>{
        if(err){
            console.log(err);
            return;
        } else{
            const hashedPassword = key.toString('hex');
            db.query('SELECT userid, userpw from user where userid = ? AND userpw = ?', [userid, key], (err, result)=> {
                if(result.length === 1){
                    res.status(200).json(result);
                } else {
                    res.status(404).json({message : '아이디나 비밀번호가 옳지 않음'})
                }
            })
        }
    })
})

app.get('/idea', (req, res) => {
    db.query('SELECT * from idea', (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'get/idea에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/idea/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM idea where userid = ?', [id], (err, results) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({ message: 'get/idea:id에서 오류 발생' });
        } else {
            db.query('SELECT name FROM user where id = ?', [id], (err, result) => {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({ message: 'get/idea:id에서 오류 발생' });
                } else {
                    db.query('SELECT * from idea where id = ?', [id], (err, idea) => {
                        if (err) {
                            console.log(err.message);
                            res.status(500).json({ message: 'get/idea:id에서 오류 발생' });
                        } else {
                            res.status(200).json({ results, result, idea });
                        }
                    })
                }
            })
        }
    })

});

app.post('/idea', (req, res) => {
    const { userid, q1, q2, q3, q4, q5, q6, checking, memo, title, color } = req.body;

    db.query('INSERT into idea (userid, q1, q2, q3, q4, q5, q6, checking, memo, title, color) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [userid, q1, q2, q3, q4, q5, q6, checking, memo, title, color], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'post/idea 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.put('/idea/:id', (req, res) => {
    const { content } = req.body;
    const { id } = req.params;

    db.query('UPDATE idea SET memo = ? WHERE IFNULL(?, 0)', [content, id], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'put/idea에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listeing on port ${port}`)
})