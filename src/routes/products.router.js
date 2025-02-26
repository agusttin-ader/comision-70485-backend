import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = express.Router();
const productManager = new ProductManager(path.resolve('src/data/products.json')); // Actualizar la ruta a la ubicación correcta

router.get('/', async (req, res) => {
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

        res.json({
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: parseInt(page),
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
            nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error obteniendo productos' });
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
