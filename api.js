const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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

    db.query('INSERT into user (name, userid, userpw) VALUES (?,?,?)', [name, userid, userpw], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'post/user에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
});

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
            console.log(results);
            db.query('SELECT name FROM user where id = ?', [id], (err, result)=>{
                if (err) {
                    console.log(err.message);
                    res.status(500).json({ message: 'get/idea:id에서 오류 발생' });
                } else {
                    res.status(200).json({ results, result });
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