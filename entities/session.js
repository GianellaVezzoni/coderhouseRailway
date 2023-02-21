import mongoose from "mongoose";

const sessionCollectionName = "users";

const sessionSchema = new mongoose.Schema({
    userName: {type: String, require: true},
    userEmail: {type: String, require: true},
    userPassword: {type: String, require: true},
    createdAt: {type: Date}
});

export default mongoose.model(sessionCollectionName, sessionSchema);