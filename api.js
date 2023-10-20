const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

const port = 3000;

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

app.post('/user', (req, res)=>{

});


app.listen(port, () => {
    console.log(`Example app listeing on port ${port}`)
})