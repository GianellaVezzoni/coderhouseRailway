import dotenv from "dotenv";
dotenv.config();

export const options = {
  client: "mysql",
  connection: {
    host: "0.0.0.0",
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

export const mongoUrl = process.env.MONGOURL
