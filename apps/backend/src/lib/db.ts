import { mapPrismaError } from "../errors/prisma.error.mapper.js";

export async function dbExecute<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    mapPrismaError(err);
  }
}

export function removeUndefinedProperties<T extends object>(obj: T): any {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  )
}