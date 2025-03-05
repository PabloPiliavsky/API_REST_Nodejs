const express = require('express');
const router = express.Router();
const Book = require('../models/book.model.js');

//Middleware
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params; //obtiene el id de los parametros de request

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {// expresion regular que chequea que sea la configuracion propia de mongo, forma del tipico id de mongo
        return res.status(404).json(
            { 
                message: 'El id del libro no es valido' 
            }
        );
    }

    try {
        book = await Book.findById(id);//busca el libro por el id definido arriba
        if(!book){
            return res.status(404).json(
                { 
                    message: 'Libro no encontrado' 
                }
            );
        }
    }
    catch (error) {
        return res.status(500).json(
            { 
                message: error.message 
            }
        );
    }
    res.book = book; // configura la respuesta con el book obtenido si todo fue correcto en el try
    next(); // esto sirve para que, luego de todo el proceso del middleware descripto antes, pueda continuar. (Podria ponerse dentro del try luego de la comprobacion)
}

//Obtener todos los books, GET==get
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();//utiliza el find() para encontrar los elementos de la coleccion de libros traidas del modelo
        console.log(books);
        
        if(books.length===0){
            return res.status(204).json([]);
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo Book, POST == post
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req.body;
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    const newBook = new Book(req.body);//tambien se puede poner la composicionigual a la del book que esta en el modelo
    try {
        const bookSaved = await newBook.save();
        console.log(bookSaved);
        
        res.status(201).json(bookSaved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', getBook, (req, res) => {
    res.json(res.book);
});

router.put('/:id', getBook, async (req, res) => {
    try{
        const book = res.book;
        book.title  = req.body.title  || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;
        const updatedBook = await save.book();
        res.json(updatedBook);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.patch('/:id', getBook, async (req, res) => {
    try{
        if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
            return res.status(400).json({ message: 'Al menos uno de estos campso debe ser completado: Titulo, Autor, genero o fecha de publicacion' });
        }
        const book = res.book;
        book.title  = req.body.title  || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;
        const updatedBook = await save.book();
        res.json(updatedBook);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/:id', getBook, async (req, res) => {
    try{
        const book = res.book;
        //esta forma toma el libro recibido y lo borra await book.remove();
        /* busca unicamente por id
            await Book.findByIdAndDelete(book._id, (err, doc) => {
                if(err){
                    return res.status(500).json({ message: err.message });
                }
        }*/
        /* este metodo busca por id tambien pero no usa mensaje de error, no es necesario
            await Book.findByIdAndDelete(book._id);
        /*
        /* este metodo busca por algun filtro, sea el id u otro valor*/
        await book.deleteOne({ _id:book._id}) 
        res.json({ message: `El libro ${book.title} eliminado` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})




module.exports  = router; //exporta el router para que pueda ser utilizado en el app.js