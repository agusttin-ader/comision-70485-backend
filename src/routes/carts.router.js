import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager('carts.json');

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json(updatedCart);
});

export default router;
