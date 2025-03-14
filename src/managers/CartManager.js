import fs from 'fs/promises';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getAllCarts() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.product === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(product => product.product !== productId);

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async updateCartProducts(cartId, products) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        cart.products = products;

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.product === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity });
        } else {
            cart.products[productIndex].quantity = quantity;
        }

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async clearCart(cartId) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        cart.products = [];

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default CartManager;
