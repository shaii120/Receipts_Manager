import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { verifyToken } from "../lib/jwt.js";
import { isUserInProject, getProjectIdFromReceipt } from '../auth/auth.service.js';
import { ProjectRequest, ReceiptRequest } from '../types/requests.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
  }
}


export async function projectAccessMiddleware(req: ProjectRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { projectId } = req.params;

    const relation = await isUserInProject(userId, projectId);
    if (!relation) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    next(error);
  }
}


export async function receiptAccessMiddleware(req: ReceiptRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { receiptId } = req.params;

    const projectId = await getProjectIdFromReceipt(receiptId);
    if (!projectId) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Receipt not found' });
    }
    console.log(`Project ID for receipt ${receiptId}: ${projectId}`);

    const relation = await isUserInProject(userId, projectId);
    if (!relation) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    next(error);
  }
}