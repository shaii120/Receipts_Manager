import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { searchUsers } from "./users.service.js";

export async function searchUsersController(req: Request, res: Response) {
    const userId = req.user!.userId;
    const email = req.query.email;

    if (typeof email !== "string") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Missing or invalid email query parameter" });
    }

    const users = await searchUsers(userId, email);

    res.json(users);
}