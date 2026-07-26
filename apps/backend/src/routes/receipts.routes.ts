import { Router } from "express";
import { createReceipt, deleteReceipt, getReceiptsByProject, updateReceipt } from "../receipts/receipts.controller.js";
import { authMiddleware, projectAccessMiddleware, receiptAccessMiddleware } from "../middlewares/auth.middleware.js";
import { paramCheckMiddleware } from "../middlewares/validation.middlewere.js";

const router: Router = Router();

router.use(authMiddleware);

router.get(
    "/:projectId",
    paramCheckMiddleware('projectId'),
    projectAccessMiddleware,
    getReceiptsByProject
);
router.post("/", createReceipt);
router.put(
    "/:receiptId",
    paramCheckMiddleware('receiptId'),
    receiptAccessMiddleware,
    updateReceipt
);
router.delete(
    "/:receiptId",
    paramCheckMiddleware('receiptId'),
    receiptAccessMiddleware,
    deleteReceipt
);

export default router;
