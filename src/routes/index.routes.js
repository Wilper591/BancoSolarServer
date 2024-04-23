import { Router } from "express";
import rutasTransaction from "./transaction.routes.js";
import rutasUsers from "./users.routes.js";
import rutasLogin from "./login.routes.js";
import { __dirname } from "../../index.js";

const router = Router();

//Login
router.get("/", (req, res) => {
  try {
    res.sendFile("index.html");
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});
router.use("/login", rutasLogin);

// Vista Admin
router.get("/dashboard", (req, res) => {
  try {
    res.sendFile(__dirname + "/public/admin.html");
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});

router.use("/dashboard/transaction", rutasTransaction);
router.use("/dashboard/users", rutasUsers);

export default router;
