import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = express.Router();
const productManager = new ProductManager(path.resolve('src/data/products.json')); // Actualizar la ruta a la ubicación correcta

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo producto por ID' });
    }
});

router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.json(deletedProduct);
});

export default router;
