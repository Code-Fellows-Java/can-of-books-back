'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
db.once('open', function () {
  console.log('Mongoose is connected to mongoose');
});

const Book = require('./models/Book.js')

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`listening on ${PORT}`));


app.get('/', (req, res) => {
  res.status(200).send('Welcome!');
});

app.get('/books', getBooks);

async function getBooks(req, res) {
  try {
    const results = await Book.find();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
}


