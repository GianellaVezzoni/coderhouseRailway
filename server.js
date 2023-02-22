import express from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cluster from "cluster";
import parseArgs from "minimist";
import passport from "passport";
import compression from "compression";
//------- Fin importación de librerías. Comienzo de importaciones propias del proyecto ----------//
import { mongoUrl } from "./config/db.js";
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
  const PORT = process.env.PORT || 8080;
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

  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
  });
}
