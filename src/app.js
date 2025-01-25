import express from 'express';
import indexRouter from './routes/index.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './managers/ProductManager.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const productManager = new ProductManager('src/data/products.json'); // Update the path to the correct location
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', productRoutes);

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error getting products' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error getting product by ID' });
    }
});

app.listen(PORT, async () => {
    try {
        await productManager.initializeProducts();
        console.log(`El servidor está corriendo en el puerto ${PORT}`);
    } catch (error) {
        console.error('Error initializing products:', error);
    }
});