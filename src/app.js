import express from 'express';
import indexRouter from './routes/index.router.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.listen(8080, () => {
    console.log("El servidor está corriendo en el puerto 8080");
});