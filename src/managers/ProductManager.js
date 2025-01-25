import fs from 'fs/promises';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAllProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading products file:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            console.error('Error getting product by ID:', error);
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
            console.error('Error adding product:', error);
            return null;
        }
    }

    async initializeProducts() {
        try {
            const initialProducts = [
                { title: "Product 1", description: "Description 1", price: 100, thumbnail: "img1.jpg", code: "P001", stock: 10 },
                { title: "Product 2", description: "Description 2", price: 200, thumbnail: "img2.jpg", code: "P002", stock: 20 },
                { title: "Product 3", description: "Description 3", price: 300, thumbnail: "img3.jpg", code: "P003", stock: 30 },
                { title: "Product 4", description: "Description 4", price: 400, thumbnail: "img4.jpg", code: "P004", stock: 40 },
                { title: "Product 5", description: "Description 5", price: 500, thumbnail: "img5.jpg", code: "P005", stock: 50 },
                { title: "Product 6", description: "Description 6", price: 600, thumbnail: "img6.jpg", code: "P006", stock: 60 },
                { title: "Product 7", description: "Description 7", price: 700, thumbnail: "img7.jpg", code: "P007", stock: 70 },
                { title: "Product 8", description: "Description 8", price: 800, thumbnail: "img8.jpg", code: "P008", stock: 80 },
                { title: "Product 9", description: "Description 9", price: 900, thumbnail: "img9.jpg", code: "P009", stock: 90 },
                { title: "Product 10", description: "Description 10", price: 1000, thumbnail: "img10.jpg", code: "P010", stock: 100 }
            ];
            const products = initialProducts.map((product, index) => ({ id: index + 1, ...product }));
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error initializing products:', error);
        }
    }

    _generateId(products) {
        return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    }
}

export default ProductManager;
