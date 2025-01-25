import express from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hola desde el router');
})

router.get('/about', (req, res) => {
    res.send('Acerca de');
})

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);

export default router;