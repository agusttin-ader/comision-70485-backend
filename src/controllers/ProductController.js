import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const productManager = new ProductManager(path.resolve('src/data/products.json')); // Actualizar la ruta a la ubicación correcta

export const getAllProducts = async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Error al obtener todos los productos' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: 'Error al obtener el producto por ID' });
    }
};

export const addProduct = async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

export const updateProductById = async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProductById(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

export const deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProductById(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(deletedProduct);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};