import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { registerUser, loginUser, getUserById } from "./auth.service.js";
import { signToken } from "../lib/jwt.js";
import { RegisterSchema, LoginSchema } from "@receipts/shared-schemas/auth";
import { UserPublic } from "./auth.types.js";

export async function register(req: Request, res: Response) {
  const data = RegisterSchema.parse(req.body);
  const { email, password } = data;
  const user = await registerUser(email, password);
  res.json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
  const data = LoginSchema.parse(req.body);
  const { email, password } = data;
  const user = await loginUser(email, password);

  if (!user) return res.status(StatusCodes.UNAUTHORIZED).send("Invalid credentials");

  const token = signToken(user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ id: user.id, email: user.email });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.send("Logged out");
}

export async function me(req: Request, res: Response) {
  const user: UserPublic | null = await getUserById(req.user?.userId!);
  res.json(user);
}