import express from "express";
import ContenedorProductos from "../containers/products/ContenedorProductos.js";

const productRouter = express.Router();
const productsObj = new ContenedorProductos(5);

productRouter.post("/", (req, res) => {
  try {
    const { body } = req;
  } catch (err) {
    res.render("modal", {
      title: "Error al cargar el producto",
      message: "",
    });
  }
});

productRouter.get("/productos-test", (req, res) => {
  try {
    const products = productsObj.generateProducts();
    res.render("table", { products });
  } catch (err) {
    res.render("modal", {
      title: "Error al cargar los productos",
      message: "",
    });
  }
});

export default productRouter;
