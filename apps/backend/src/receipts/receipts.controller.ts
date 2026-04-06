import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createReceiptService, getReceiptsByProjectService, getReceiptsService } from "./receipts.service.js";
import { ReceiptCreateSchema } from "@receipts/shared-schemas";
import { ProjectRequest } from "../types/requests.js";

export async function createReceipt(req: Request, res: Response) {
    try {
        req.body.projectId = req.params.projectId;
        const data = ReceiptCreateSchema.parse(req.body);
        const receipt = await createReceiptService(data);
        res.json(receipt);
    } catch (err: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
}

export async function getReceipts(_req: Request, res: Response) {
    const receipts = await getReceiptsService();
    res.json(receipts);
}


export async function getReceiptsByProject(req: ProjectRequest, res: Response) {
    const projectId: string = req.params.projectId;
    const receipts = await getReceiptsByProjectService(projectId);
    res.json(receipts);
}
