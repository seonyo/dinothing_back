const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

const port = 3000;


app.use(cors());


app.listen(port, () => {
    console.log(`Example app listeing on port ${port}`)
})