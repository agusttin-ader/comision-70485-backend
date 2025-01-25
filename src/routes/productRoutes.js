import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProductById, deleteProductById } from '../controllers/ProductController.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        await getAllProducts(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud GET para todos los productos:', error);
        res.status(500).json({ error: 'Error al manejar la solicitud GET para todos los productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        await getProductById(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud GET para el producto por ID:', error);
        res.status(500).json({ error: 'Error al manejar la solicitud GET para el producto por ID' });
    }
});

router.post('/', async (req, res) => {
    try {
        await addProduct(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud POST para agregar un producto:', error);
        res.status(500).json({ error: 'Error al manejar la solicitud POST para agregar un producto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateProductById(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud PUT para actualizar un producto:', error);
        res.status(500).json({ error: 'Error al manejar la solicitud PUT para actualizar un producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteProductById(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud DELETE para eliminar un producto:', error);
        res.status(500).json({ error: 'Error al manejar la solicitud DELETE para eliminar un producto' });
    }
});

export default router;
