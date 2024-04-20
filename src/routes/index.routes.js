import { Router } from "express";
import rutasTransaction from "./transaction.routes.js"
import rutasUsers from "./users.routes.js";
const router = Router();

//Rutas Principal
router.get("/", (req, res) => {
  try {
    res.sendFile("index.html");
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});

router.use("/transaction", rutasTransaction)
router.use("/users", rutasUsers)

export default router;