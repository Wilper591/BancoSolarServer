import { Router } from "express";
import { loginUser } from "../controllers/login.controller.js";
const router = Router();


router.get("/admin", async (req, res) => {
  try {
    const { user, password } = req.query;
    const login = await loginUser(user, password);
    res.send(login);
  } catch (error) {
    console.error("Hubo un error:", error.message);
    res.status(500).send(error.message);
  }
});

export default router;
