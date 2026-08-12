import { z } from "zod";
import { ReceiptResultSchema } from "../generated/Receipt.schema.js"

export const ReceiptMutationResultSchema = z.object({
    receipt: ReceiptResultSchema,
    totalAmount: z.number()
})
export type ReceiptMutationResult = z.infer<typeof ReceiptMutationResultSchema>

export const ReceiptDeleteResultSchema = z.object({
    totalAmount: z.number()
})
export type ReceiptDeleteResult = z.infer<typeof ReceiptDeleteResultSchema>