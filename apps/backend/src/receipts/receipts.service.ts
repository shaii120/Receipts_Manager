import { Prisma } from "@prisma/client";
import { prisma } from "prisma-my-db/connector";
import type {
    ReceiptCreate,
    ReceiptModel,
    ReceiptUpdate
} from "@receipts/shared-schemas";
import type {
    ReceiptMutationResult,
    ReceiptDeleteResult
} from "@receipts/shared-schemas/receipt"
import { dbExecute, removeUndefinedProperties } from "../lib/db.js";
import { getExchangeRate } from "../currencies/currencies.service.js";

export async function createReceiptService(data: ReceiptCreate): Promise<ReceiptMutationResult> {
    return dbExecute(async () => {
        const project = await prisma.project.findUnique({
            where: { id: data.projectId },
            select: { primaryCurrency: true }
        });

        if (!project) {
            throw new Error("Project not found");
        }

        const rate = await getExchangeRate(
            data.currency,
            project.primaryCurrency,
            data.boughtAt
        );

        return prisma.$transaction(async (tx) => {

            const receipt = await tx.receipt.create({
                data: {
                    ...data,
                    vendor: data.vendor ?? null
                }
            });

            const convertedAmount = receipt.amount.mul(new Prisma.Decimal(rate));

            const updatedProject = await tx.project.update({
                where: { id: data.projectId },
                data: {
                    totalAmount: {
                        increment: convertedAmount
                    }
                },
                select: {
                    totalAmount: true
                }
            });

            return {
                receipt: {
                    ...receipt,
                    amount: Number(receipt.amount)
                },
                totalAmount: Number(updatedProject.totalAmount)
            };
        });
    });
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
    )
        .then((receipts) =>
            receipts.map(rec => ({
                ...rec,
                amount: Number(rec.amount)
            })))
}

export async function updateReceiptService(receiptId: string, data: ReceiptUpdate): Promise<ReceiptMutationResult> {
    return dbExecute(async () => {
        const receipt = await prisma.receipt.findUnique({
            where: { id: receiptId }
        });

        if (!receipt) {
            throw new Error("Receipt not found");
        }

        const project = await prisma.project.findUnique({
            where: { id: receipt.projectId },
            select: { primaryCurrency: true }
        });

        if (!project) {
            throw new Error("Project not found");
        }

        const updatedData = removeUndefinedProperties(data);

        const newAmount = (updatedData.amount !== undefined)
            ? new Prisma.Decimal(updatedData.amount)
            : receipt.amount;
        const newCurrency = updatedData.currency ?? receipt.currency;
        const newBoughtAt = updatedData.boughtAt ?? receipt.boughtAt;

        const oldRate = await getExchangeRate(
            receipt.currency,
            project.primaryCurrency,
            receipt.boughtAt
        );
        const oldConvertedAmount = receipt.amount.mul(new Prisma.Decimal(oldRate));

        const newRate = await getExchangeRate(
            newCurrency,
            project.primaryCurrency,
            newBoughtAt
        );
        const newConvertedAmount = newAmount.mul(new Prisma.Decimal(newRate));
        const amountDifference = newConvertedAmount.minus(oldConvertedAmount);

        return prisma.$transaction(async (tx) => {
            const updatedReceipt = await tx.receipt.update({
                where: { id: receiptId },
                data: updatedData
            });

            let totalAmount: Prisma.Decimal;

            if (!amountDifference.isZero()) {
                const updatedProject = await tx.project.update({
                    where: { id: receipt.projectId },
                    data: {
                        totalAmount: {
                            increment: amountDifference
                        }
                    },
                    select: {
                        totalAmount: true
                    }
                });

                totalAmount = updatedProject.totalAmount;
            }
            else {
                const project = await tx.project.findUnique({
                    where: { id: receipt.projectId },
                    select: {
                        totalAmount: true
                    }
                });

                if (!project) {
                    throw new Error("Project not found");
                }

                totalAmount = project.totalAmount;
            }

            return {
                receipt: {
                    ...updatedReceipt,
                    amount: Number(updatedReceipt.amount)
                },
                totalAmount: Number(totalAmount)
            };
        });
    });
}

export async function deleteReceiptService(receiptId: string): Promise<ReceiptDeleteResult> {
    return dbExecute(() =>
        prisma.$transaction(async (tx) => {
            const receipt = await tx.receipt.findUnique({
                where: { id: receiptId }
            });

            if (!receipt) {
                throw new Error("Receipt not found");
            }

            const project = await tx.project.findUnique({
                where: { id: receipt.projectId },
                select: { primaryCurrency: true }
            });

            if (!project) {
                throw new Error("Project not found");
            }

            const rate = await getExchangeRate(
                receipt.currency,
                project.primaryCurrency,
                receipt.boughtAt
            );

            const convertedAmount = receipt.amount.mul(new Prisma.Decimal(rate));

            await tx.receipt.delete({
                where: { id: receiptId }
            });

            const updatedProject = await tx.project.update({
                where: { id: receipt.projectId },
                data: {
                    totalAmount: {
                        decrement: convertedAmount
                    }
                },
                select: {
                    totalAmount: true
                }
            });

            return {
                totalAmount: Number(updatedProject.totalAmount)
            };
        })
    );
}