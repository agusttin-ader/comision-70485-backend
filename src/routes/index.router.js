import express from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = express.Router();
const productManager = new ProductManager(path.resolve('src/data/products.json')); // Asegurarse de que la ruta sea correcta

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.send('Acerca de');
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error); // Agregar logging para más detalles
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);

export default router;