import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './managers/ProductManager.js';
import productRoutes from './routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const productManager = new ProductManager(path.resolve('src/data/products.json'));
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    block: function(name) {
      if (!this._blocks) this._blocks = {};
      var blocks = this._blocks;
      var content = blocks[name] || (blocks[name] = []);
      content.push(this.fn(this));
      return null;
    },
    content: function(name) {
      var blocks = this._blocks;
      var content = blocks && blocks[name];
      return content ? content.join('\n') : null;
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', productRoutes);

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('products', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto por ID' });
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error); // Agregar logging para más detalles
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        io.emit('productUpdate', await productManager.getAllProducts());
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

app.delete('/api/products/:pid', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProductById(req.params.pid);
        io.emit('productUpdate', await productManager.getAllProducts());
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// Conexión Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            const products = await productManager.getAllProducts();
            io.emit('productUpdate', products);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProductById(id);
            const products = await productManager.getAllProducts();
            io.emit('productUpdate', products);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, async () => {
    try {
        await productManager.initializeProducts();
        console.log(`El servidor está corriendo en el puerto ${PORT}`);
    } catch (error) {
        console.error('Error al inicializar productos:', error);
    }
});