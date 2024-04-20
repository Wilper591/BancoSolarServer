import { Router } from "express";
const router = Router();
import {
  createUser,
  getUsers,
  deleteUser,
  editUser,
} from "../controllers/users.controller.js";

//Crea nuevo usuario
router.post("/usuario", async (req, res) => {
  try {
    const { nombre, balance } = req.body;
    const newUser = await createUser(nombre, balance);
    res.send(newUser);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

//Trae la Lista de Usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const getListUsers = await getUsers();
    res.send(getListUsers);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

//Edita los datos del usuario
router.put("/usuario", async (req, res) => {
  try {
    const { nombre, balance } = req.body;
    const { id } = req.query;
    const uptdateUser = await editUser(nombre, balance, id);
    res.send(uptdateUser);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

//Elimina usuarios por ID
router.delete("/usuario", async (req, res) => {
  try {
    const { id } = req.query;
    const eraseUser = await deleteUser(id);
    res.send(eraseUser);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

export default router;
