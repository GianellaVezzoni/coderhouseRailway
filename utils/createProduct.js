const faker = require("faker");
faker.locale = 'es';

module.exports = function createProduct(){
    return {
        name: faker.commerce.productName(),
        price: faker.commerce.price(100, 200, 0, '$'),
        picture: faker.image.abstract()
    }
}