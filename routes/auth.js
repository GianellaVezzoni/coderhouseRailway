import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import knex from "knex";
import express from "express";
import { comparePasswords } from "../utils/encryptPassword.js";
import SessionsController from "../controllers/SessionsController.js";
import Contenedor from "../containers/products/Contenedor.js";
import { options } from "../config/db.js";

const authRouter = express.Router();
const mongoSession = new SessionsController();
const knexInstance = knex(options);
const sql = new Contenedor(knexInstance);

//Passport

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "userEmail",
      passwordField: "userPassword",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { userName } = req.body;
      const userCreation = await mongoSession.createUser({
        userName,
        username,
        password,
      });
      if (userCreation === null) {
        done("Error al registrarse", false);
      }
      req.session.user = userCreation;
      done(null, userCreation);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "userEmail",
      passwordField: "userPassword",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const user = await mongoSession.getUserByEmail(username);
      if (user === null) {
        return done("No se encontró el usuario", false);
      }
      const passwordComparedResult = await comparePasswords(
        password,
        user.userPassword
      );
      if (!passwordComparedResult) {
        return done("Contraseña incorrecta", false);
      }
      req.session.user = user;
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.userEmail);
});

passport.deserializeUser(async (userEmail, done) => {
  const user = await mongoSession.getUserByEmail(userEmail);
  done(null, user);
});

// ------------ Rutas de login  ------------ //

authRouter.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    req.session.user = req.session.passport.user;
    const user = req.session.user;
    sql.listProducts().then((prod) => {
      let products = [];
      products = prod.map((item) => ({
        productName: item?.productName,
        productPrice: item?.productPrice,
        productImage: item?.productImage,
      }));
      res.render("form", { products, user });
    });
  } else {
    res.render("login");
  }
});

authRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/loginError",
    successRedirect: "/",
  })
);

authRouter.get("/loginError", (req, res) => {
  res.render("loginError");
});

// ------------ Rutas de registro  ------------ //

authRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/registerError",
    successRedirect: "/",
  })
);

authRouter.get("/register", async (_, res) => {
  res.render("register");
});

authRouter.get("/registerError", (_, res) => {
  res.render("registerError");
});

authRouter.get("/logout", async (req, res) => {
  const user = req.session.user;
  await mongoSession.deleteSession(user);
  res.render("logout", { user });
  req.session.destroy();
});

export default authRouter;
