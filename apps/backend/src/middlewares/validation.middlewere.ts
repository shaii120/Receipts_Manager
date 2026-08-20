import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes.js';

export function paramCheckMiddleware(paramName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const paramValue = req.params[paramName];

            if (!userId || !paramValue || typeof paramValue !== 'string') {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: `Missing userId or ${paramName}` });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export function queryParamCheckMiddleware(paramName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paramValue = req.query[paramName];

            if (paramValue !== undefined && typeof paramValue !== 'string') {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: `Invalid ${paramName}`
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}