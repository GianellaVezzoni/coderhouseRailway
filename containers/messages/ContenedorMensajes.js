export default class ContenedorMensajes {
    constructor(options){
        this.knex = options;
    }

    createMessagesTable(){
        return this.knex.schema.dropTableIfExists('messages')
        .finally(() => {
            return this.knex.schema.createTable('messages', table => {
                table.increments('id').primary()
                table.string('email', 100).notNullable()
                table.string('text', 100)
                table.string('date', 20)
            });
        })
    }

    createMessage(message){

        return this.knex.from('messages').insert(message);
    }

    getMessages(){
        return this.knex.from('messages').select('*');
    }

    close(){
        this.knex.destroy();
    }

}
