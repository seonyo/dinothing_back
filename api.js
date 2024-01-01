require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const auth = require('./routes/auth');
app.use('/auth', auth);

const idea = require('./routes/idea');
app.use('/idea', idea);

app.listen(port, () => {
    console.log(`Example app listeing on port ${port}`)
});