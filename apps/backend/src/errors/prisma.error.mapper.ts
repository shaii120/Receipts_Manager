import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { ConflictError } from "./conflict.error.js";
import { AppError } from "./app.error.js";


type PrismaMetaP2002Field = {
  modelName: string;
};

function getP2002Field(
  err: Prisma.PrismaClientKnownRequestError
): string | undefined {
  const meta = err.meta as PrismaMetaP2002Field | undefined;
  return meta?.modelName;
}

export function mapPrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        const field = getP2002Field(err);
        throw new ConflictError(field ? `${field} already exists` : "Resource already exists");

      case "P2025":
        throw new AppError("Resource not found", StatusCodes.NOT_FOUND);

      default:
        throw new AppError("Database error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  throw err;
}
