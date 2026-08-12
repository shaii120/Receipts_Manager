import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ReceiptCreateSchema, ReceiptUpdateSchema } from "@receipts/shared-schemas";
import {
    createReceiptService,
    deleteReceiptService,
    getReceiptsByProjectService,
    updateReceiptService
} from "./receipts.service.js";
import { ProjectRequest, ReceiptRequest } from "../types/requests.js";

export async function createReceipt(req: Request, res: Response) {
    try {
        const data = ReceiptCreateSchema.parse(req.body);
        const receipt = await createReceiptService(data);
        res.json(receipt);
    } catch (err: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
}

export async function getReceiptsByProject(req: ProjectRequest, res: Response) {
    const projectId: string = req.params.projectId;
    const receipts = await getReceiptsByProjectService(projectId);
    res.json(receipts);
}

export async function updateReceipt(req: ReceiptRequest, res: Response) {
    const receiptId: string = req.params.receiptId
    const parsed = ReceiptUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid project data', errors: parsed.error });
    }

    try {
        const updatedReceipt = await updateReceiptService(receiptId, parsed.data);
        res.json(updatedReceipt);
    } catch (err: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
}

export async function deleteReceipt(req: ReceiptRequest, res: Response) {
    const receiptId: string = req.params.receiptId;
    try {
        const projectTotalAmount = await deleteReceiptService(receiptId);
        res.json(projectTotalAmount);
    } catch (err: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
}