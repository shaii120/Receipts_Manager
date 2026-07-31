import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCurrencies } from "./currencies.service.js";

export async function getCurrenciesController(req: Request, res: Response) {
    try {
        const currencies = await getCurrencies();
        res.json(currencies);
    } catch (err: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err.message
        });
    }
}