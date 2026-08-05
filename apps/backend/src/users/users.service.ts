import { prisma } from "prisma-my-db/connector";
import { UserPublic } from "@receipts/shared-schemas/auth";
import { dbExecute } from "../lib/db.js";
import { userPublicSelect } from "./users.types.js";

export async function getUserById(userId: string): Promise<UserPublic | null> {
  return dbExecute(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect
    })
  );
}