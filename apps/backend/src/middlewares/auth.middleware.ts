import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { verifyToken } from "../lib/jwt.js";
import { isUserInProject } from '../auth/auth.service.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
  }
}


export async function projectAccessMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    if (!userId || !projectId || typeof projectId !== 'string') {
      return res.status(400).json({ message: 'Missing userId or projectId' });
    }

    const relation = await isUserInProject(userId, projectId);

    if (!relation) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    next(error);
  }
}