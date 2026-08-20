import { Request } from "express";

export interface ProjectRequest extends Request {
    params: {
        projectId: string;
    };
}

export interface ReceiptRequest extends Request {
    params: {
        receiptId: string;
    };
}

export interface ProjectQueryRequest extends Request {
    query: {
        parentProjectId?: string;
    };
}