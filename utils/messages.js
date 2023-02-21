import util from "util";
import { normalize, schema } from "normalizr";

const mensajes = {
    id: '1',
    messages: [
        {
            author: {
                email: 'vezzoni.00@gmail.com',
                name: 'Gianella',
                lastname: 'Vezzoni',
                age: '21',
                alias: 'vezzonig',
                avatar: 'https://gvezzoni.com/wp-content/uploads/2023/01/logo-profile.png'
            },
            date: '9/1/2023, 08:00:00',
            text: 'Mensaje de prueba',
            id: 0
        },
        {
            author: {
                email: 'vezzoni.00@gmail.com',
                name: 'Gianella',
                lastname: 'Vezzoni',
                age: '21',
                alias: 'vezzonig',
                avatar: 'https://gvezzoni.com/wp-content/uploads/2023/01/logo-profile.png'
            },
            date: '9/1/2023, 08:00:00',
            text: 'Mensaje num 2',
            id: 1
        },
        {
            author: {
                email: 'vezzoni.00@gmail.com',
                name: 'Cleo',
                lastname: 'Lopez',
                age: '30',
                alias: 'cleo',
                avatar: 'https://gvezzoni.com/wp-content/uploads/2023/01/logo-profile.png'
            },
            date: '10/1/2023, 08:00:00',
            text: 'Mensaje de prueba',
            id: 2
        }
    ]
}

function printMessages(obj){
    console.log(util.inspect(obj, false, 12, true));
}

const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});

const messageSchema = new schema.Entity('message', {
    author: authorSchema
});

const messagesSchema = new schema.Entity('messages', {
    messages: [messageSchema]
});

const messagesNormalized = normalize(mensajes, messagesSchema);
printMessages(messagesNormalized);