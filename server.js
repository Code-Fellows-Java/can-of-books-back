'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

app.use(express.json());

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

async function getBooks(req, res, next) {
  try {
    const results = await Book.find();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
}



app.post('/books', postBooks);

async function postBooks(req, res, next) {
  console.log(req.body);
  try {
    const newBook = await Book.create(req.body);
    res.status(200).send(newBook);
  } catch (error) {
    next(error);
  }
}

app.delete('/books/:id', deleteBook);

async function deleteBook(req, res, next) {
  const id = req.params.id;
  console.log(id)
  try {
    await Book.findByIdAndDelete(id);
    res.status(200).send('Book deleted');
  } catch (error) {
    next(error);
  }
}



app.put('/books/:id', putBook);

async function putBook(req, res, next) {
  const id = req.params.id;
  console.log(id);
  try {
    const data = req.body;
    const options = {
      new: true,
      overwrite: true,
    };
    const updatedBook = await Book.findByIdAndUpdate(id, data, options);
    res.status(201).send(updatedBook);
  } catch (error) {
    next(error);
  }
}


app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});


app.use((error, req, res) => {
  res.status(500).send(error.message);
});
