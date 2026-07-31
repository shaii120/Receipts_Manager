import { Router } from "express";

import { getCurrenciesController } from "../currencies/currencies.controller.js";

const router: Router = Router();

router.get("/", getCurrenciesController);

export default router;