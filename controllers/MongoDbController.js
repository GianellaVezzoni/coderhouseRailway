import mongoose from "mongoose";
import { mongoUrl } from "../config/db.js";
 
export default class MongoDbController {
    async connect(){
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }).then(() => console.log('mongoose connected!'))
    }

    async disconnect(){
        mongoose.disconnect();
    }
}
