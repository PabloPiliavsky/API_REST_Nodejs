const express = require('express');
const { config } = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
config();

const bookRoutes= require('./routes/book.routes');//dependiendo el tipo de DB y la cantidad de rutas, se pueden importar de una forma u otra para no tener problemas con el llamado de cada una en comparacion con la de las demas

//usamos express para los middlewares y rutas
const app = express();
app.use(bodyParser.json()); // parsea el body de las request a json

console.log('mongo_url:',process.env);

//conexion con la base de datos
mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME,
});

const db = mongoose.connection;

app.use('/books', bookRoutes);//se usa el prefijo /books para las rutas de los libros


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor inciado en el puerto ${port}`); // es equivalente a agregarlo con un + luego de cerrar las comillas
    
})