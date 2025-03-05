const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({ // forma del objeto de tipo book
    title: String,
    author: String,
    genre: String,
    publication_date: String
});

module.exports = mongoose.model('Book', bookSchema); // exporta el modelo de book con el esquema de bookSchema