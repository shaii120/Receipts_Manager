import { Router } from "express";
import { searchUsersController } from "../users/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.use(authMiddleware);
router.get("/search", searchUsersController);

export default router;