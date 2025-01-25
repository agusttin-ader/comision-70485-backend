import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
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
