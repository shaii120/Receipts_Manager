import { Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { AppError } from "../errors/app.error.js";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
}