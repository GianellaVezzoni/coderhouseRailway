import dotenv from "dotenv";
dotenv.config();

export const options = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommerce",
  },
};

export const optionsSqlite = {
  client: "sqlite3",
  connection: {
    filename: "./ecommerce.sqlite",
  },
  useNullAsDefault: true,
};

export const mongoUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@desafio24.bmolsth.mongodb.net/?retryWrites=true&w=majority`;
