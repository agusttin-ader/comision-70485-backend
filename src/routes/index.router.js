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

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, available } = req.query;

        let products = await productManager.getAllProducts();

        // Filtrar por query
        if (query) {
            products = products.filter(product => 
                product.title.includes(query) || 
                product.description.includes(query)
            );
        }

        // Filtrar por categoría
        if (category) {
            products = products.filter(product => product.category === category);
        }

        // Filtrar por disponibilidad
        if (available) {
            const isAvailable = available === 'true';
            products = products.filter(product => product.stock > 0 === isAvailable);
        }

        // Ordenar productos
        if (sort) {
            products.sort((a, b) => {
                if (sort === 'asc') {
                    return a.price - b.price;
                } else if (sort === 'desc') {
                    return b.price - a.price;
                }
                return 0;
            });
        }

        // Paginar productos
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = products.slice(startIndex, endIndex);

        const totalPages = Math.ceil(products.length / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        res.render('index', {
            products: paginatedProducts,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: parseInt(page),
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
            nextLink: hasNextPage ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error obteniendo productos' });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.render('productDetails', { product });
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo producto por ID' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // "Populate" los productos
        const populatedCart = await cartManager.populateCartProducts(cart, productManager);
        res.render('cart', { cart: populatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);

export default router;