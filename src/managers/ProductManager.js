import { promises as fs } from 'fs';
import path from 'path';

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath); 
    }

    async getAllProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error); // Agregar logging para más detalles
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getAllProducts();
            const newProduct = {
                id: this._generateId(products),
                ...product
            };
            products.push(newProduct);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async updateProductById(id, updatedProduct) {
        try {
            const products = await this.getAllProducts();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }
            products[index] = { ...products[index], ...updatedProduct };
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProductById(id) {
        try {
            const products = await this.getAllProducts();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }
            const deletedProduct = products.splice(index, 1);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return deletedProduct[0];
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }

    async initializeProducts() {
        try {
            const initialProducts = [
                { title: "Producto 1", description: "Descripción 1", price: 100, thumbnail: "img1.jpg", code: "P001", stock: 10 },
                { title: "Producto 2", description: "Descripción 2", price: 200, thumbnail: "img2.jpg", code: "P002", stock: 20 },
                { title: "Producto 3", description: "Descripción 3", price: 300, thumbnail: "img3.jpg", code: "P003", stock: 30 },
                { title: "Producto 4", description: "Descripción 4", price: 400, thumbnail: "img4.jpg", code: "P004", stock: 40 },
                { title: "Producto 5", description: "Descripción 5", price: 500, thumbnail: "img5.jpg", code: "P005", stock: 50 },
                { title: "Producto 6", description: "Descripción 6", price: 600, thumbnail: "img6.jpg", code: "P006", stock: 60 },
                { title: "Producto 7", description: "Descripción 7", price: 700, thumbnail: "img7.jpg", code: "P007", stock: 70 },
                { title: "Producto 8", description: "Descripción 8", price: 800, thumbnail: "img8.jpg", code: "P008", stock: 80 },
                { title: "Producto 9", description: "Descripción 9", price: 900, thumbnail: "img9.jpg", code: "P009", stock: 90 },
                { title: "Producto 10", description: "Descripción 10", price: 1000, thumbnail: "img10.jpg", code: "P010", stock: 100 }
            ];
            const products = initialProducts.map((product, index) => ({ id: index + 1, ...product }));
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error al inicializar los productos:', error);
        }
    }

    _generateId(products) {
        return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    }
}

export default ProductManager;
