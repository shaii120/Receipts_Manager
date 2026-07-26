import { UserPublic } from "@receipts/shared-schemas/auth";
import { prisma } from "prisma-my-db/connector";
import { hashPassword, comparePassword } from "../lib/hash.js";
import { dbExecute } from "../lib/db.js";
import { userPublicSelect } from "./auth.types.js";


export async function registerUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);
  return dbExecute(() =>
    prisma.user.create({ data: { email, passwordHash } }));
}

export async function loginUser(email: string, password: string) {
  const user = await dbExecute(() =>
    prisma.user.findUnique({ where: { email } }));
  if (!user) return null;

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return null;

  return user;
}

export async function getUserById(userId: string): Promise<UserPublic | null> {
  return dbExecute(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect
    })
  );
}

export async function getProjectIdFromReceipt(receiptId: string): Promise<string | null> {
  const receipt = await dbExecute(() =>
    prisma.receipt.findUnique({
      where: { id: receiptId },
      select: { projectId: true }
    })
  );

  return receipt?.projectId || null;
}

export async function isUserInProject(userId: string, projectId: string): Promise<boolean> {
  const relation = await dbExecute(() =>
    prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      }
    })
  );

  return !!relation;
}