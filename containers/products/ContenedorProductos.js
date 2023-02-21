import faker from "faker";
faker.locale = 'es';

export default class ContenedorProductos {
    constructor(quantity){
        this.quantity = quantity;
    }

    generateProducts() {
        const products = [];
        for (let i = 0; i < this.quantity; i++){
            const obj = {
                productName: faker.commerce.productName(),
                productPrice: faker.commerce.price(100, 200, 0, '$'),
                productImage: faker.image.nature()
            }
            products.push(obj);
        }
        return products;
    }

}