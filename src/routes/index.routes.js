import { Router } from "express";
import rutasTransaction from "./transaction.routes.js";
import rutasUsers from "./users.routes.js";
import rutasLogin from "./login.routes.js";

const router = Router();


router.use("/login", rutasLogin);
router.use("/transaction", rutasTransaction);
router.use("/usuarios", rutasUsers);

export default router;
