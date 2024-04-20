import { Router } from "express";
const router = Router();
import {
  getTransactions,
  createTransaction,
} from "../controllers/transaction.controller.js";

//Trae la Lista de Transferencias
router.get("/transferencias", async (req, res) => {
  try {
    const getTransferList = await getTransactions();
    res.send(getTransferList);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

/* Genera una transferencia entre cuentas de usuario
 y crea un registro de transferencia */
router.post("/transferencia", async (req, res) => {
  try {
    const { emisor, receptor, monto } = req.body;
    const newRegister = await createTransaction(emisor, receptor, monto);
    res.send(newRegister);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});


export default router;
