export default class Contenedor {
    constructor(options){
        this.knex = options;
    }
    
    createTable(){
        return this.knex.schema.dropTableIfExists('products')
        .finally(() => {
            return this.knex.schema.createTable('products', table => {
                table.increments('id').primary()
                table.string('productName', 15).notNullable()
                table.float('productPrice')
                table.string('productImage', 100)
            })
        })
    }

    insertProduct(products){
        return this.knex.from('products').insert(products);
    }

    listProducts(){
        return this.knex.from('products').select('*');
    }

    deleteProduct(productId){
        return this.knex.from('products').where('id', '=', productId).del();
    }

    close(){
        this.knex.destroy();
    }

}
