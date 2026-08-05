import { prisma } from "prisma-my-db/connector";
import { dbExecute, removeUndefinedProperties } from "../lib/db.js";
import { ReceiptCreate, ReceiptModel, ReceiptUpdate } from "@receipts/shared-schemas";

export async function createReceiptService(data: ReceiptCreate): Promise<ReceiptModel> {
  const dataInput = { ...data, vendor: data.vendor ?? null };
  return dbExecute(() =>
    prisma.receipt.create({ data: dataInput }));
}

export async function getReceiptsByProjectService(projectId: string): Promise<ReceiptModel[]> {
  return dbExecute(() =>
    prisma.receipt.findMany({
      where: {
        projectId: projectId
      },
      orderBy: {
        boughtAt: 'desc'
      }
    })
  );
}

export async function updateReceiptService(receiptId: string, data: ReceiptUpdate): Promise<ReceiptModel> {
  const dataInput = removeUndefinedProperties(data);
  return dbExecute(() =>
    prisma.receipt.update({
      where: { id: receiptId },
      data: dataInput
    })
  );
}

export async function deleteReceiptService(receiptId: string): Promise<void> {
  await dbExecute(() =>
    prisma.receipt.delete({
      where: { id: receiptId }
    })
  );
}