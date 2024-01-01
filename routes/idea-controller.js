const db = require('../db/db');

exports.listGetMid = (req, res) => {
    db.query('SELECT * from idea', (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'get/idea에서 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.viewIndexGetMid = (req, res) => {
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

};

exports.writePostMid = (req, res) => {
    const { userid, q1, q2, q3, q4, q5, q6, checking, memo, title, color } = req.body;

    db.query('INSERT into idea (userid, q1, q2, q3, q4, q5, q6, checking, memo, title, color) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [userid, q1, q2, q3, q4, q5, q6, checking, memo, title, color], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'post/idea 오류 발생' });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.updateIndexPatchMid = (req, res) => {
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
};