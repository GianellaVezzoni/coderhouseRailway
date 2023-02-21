import express from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import knex from "knex";
import knexSqlite from "knex";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cluster from "cluster";
import parseArgs from "minimist";
import passport from "passport";
import compression from "compression";
//------- Fin importación de librerías. Comienzo de importaciones propias del proyecto ----------//
import ContenedorProductos from "./containers/products/ContenedorProductos.js";
import ContenedorMensajes from "./containers/messages/ContenedorMensajes.js";
import ContenedorMensajesNormalized from "./containers/messages/ContenedorMensajesNormalized.js";
import Contenedor from "./containers/products/Contenedor.js";
import { mongoUrl, optionsSqlite, options } from "./config/db.js";
import { puerto } from "./config/argsParser.js";
import authRouter from './routes/auth.js';
import productRouter from './routes/products.js';
import infoRoutes from "./routes/info.js";
import {logRequest, loginRequest} from "./middlewares/logs.js";

export const args = parseArgs(process.argv.slice(2));

const SERVER_MODE = args.serverMode || "FORK";
if (SERVER_MODE === "CLUSTER" && cluster.isPrimary) {
  for (let index = 0; index < 7; index++) {
    cluster.fork();

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker con PID: ${worker.process.pid} finalizado`);
    });
  }
} else {
  serverExecution();
}

function serverExecution() {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("./public"));
  app.use(compression());
  app.use(logRequest)
  app.engine("handlebars", engine());
  app.set("views", "./public");
  app.set("view engine", "handlebars");
  app.use(cookieParser("GianellaCookieTest"));
  const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };  

  const httpServer = HttpServer(app);
  const io = new IOServer(httpServer);
  const PORT = process.env.PORT || 8080;
  const productsObj = new ContenedorProductos(5);
  const messagesContainer = new ContenedorMensajesNormalized("messages.txt");
  const knexSqliteInstance = knexSqlite(optionsSqlite);
  const sqlite = new ContenedorMensajes(knexSqliteInstance);
  const knexInstance = knex(options);
  const sql = new Contenedor(knexInstance);

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: mongoUrl,
        mongoOptions: mongoOptions,
        ttl: 600,
      }),
      secret: "GianeTestSecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  //Routes
  app.use('/', authRouter);
  app.use('/productos', productRouter);
  app.use('/api', infoRoutes);

  app.get("*", loginRequest, (_, res) => {
    res.redirect("/api/info");
  });

  sql.createTable().then(() => console.log("Tabla creada"));
  sqlite.createMessagesTable().then(() => console.log("Tabla mensajes creada"));

  io.on("connection", (socket) => {
    const products = productsObj.generateProducts();
    socket.emit("products", products);
    socket.on("new-product", (data) => {
      try{
        sql.insertProduct(data).then((prod) => {
          io.sockets.emit("products", prod);
        });
      }catch(err){
        logger.error(`Error saving products ${err}`)
      }
    });
    const messageList = messagesContainer.getAllMessages();
    socket.emit("messages", messageList);
    socket.on("new-message", (data) => {
      try{
        const message = messagesContainer.save(data);
      io.sockets.emit("messages", message);
      }catch(err){
        logger.error(`Error saving messages ${err}`)
      }
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
  });
}
