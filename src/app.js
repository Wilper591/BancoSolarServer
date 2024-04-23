import rutas from "./routes/index.routes.js";
import express from "express";
import { __dirname } from "../index.js";
import cors from "cors";
const app = express();
const PORT = 3000;

//Middlewares
app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rutas
app.use("/apiV1", rutas);

//Ruta Genérica
app.get("*/*", (req, res) => {
  try {
    res.status(404).sendFile(__dirname + "/public/404.html");
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});

export { app, PORT };
