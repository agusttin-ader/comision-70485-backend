import express from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = express.Router();
const cartManager = new CartManager(path.resolve('src/data/carts.json'));
const productManager = new ProductManager(path.resolve('src/data/products.json'));

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.json(newCart);
});

// Obtener carrito con productos completos (populate)
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // "Populate" los productos
        const populatedCart = await cartManager.populateCartProducts(cart, productManager);
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json(updatedCart);
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCartProducts(req.params.cid, req.body.products);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar los productos del carrito' });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartManager.clearCart(req.params.cid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});

export default router;