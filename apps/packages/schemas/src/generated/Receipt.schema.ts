import { z } from "zod";

export const ReceiptModelSchema = z.object({
	id: z.string().nonempty("id is required"),
	title: z.string().nonempty("title is required"),
	amount: z.number("amount should be a number"),
	currency: z.string().nonempty("currency is required"),
	vendor: z.string().nullish(),
	boughtAt: z.string().pipe(z.coerce.date()),
	projectId: z.string().nonempty("projectId is required")
});
export type ReceiptModel = z.infer<typeof ReceiptModelSchema>;
export type ReceiptModelInput = z.input<typeof ReceiptModelSchema>;

export const ReceiptCreateSchema = z.object({
	title: z.string().nonempty("title is required"),
	amount: z.number("amount should be a number"),
	currency: z.string().nonempty("currency is required"),
	vendor: z.string().nullish(),
	boughtAt: z.string().pipe(z.coerce.date()),
	projectId: z.string().nonempty("projectId is required")
});
export type ReceiptCreate = z.infer<typeof ReceiptCreateSchema>;
export type ReceiptCreateInput = z.input<typeof ReceiptCreateSchema>;

export const ReceiptUpdateSchema = z.object({
	title: z.string().nullish(),
	amount: z.number("amount should be a number").nullish(),
	currency: z.string().nullish(),
	vendor: z.string().nullish(),
	boughtAt: z.string().pipe(z.coerce.date()).nullish()
});
export type ReceiptUpdate = z.infer<typeof ReceiptUpdateSchema>;
export type ReceiptUpdateInput = z.input<typeof ReceiptUpdateSchema>;

export const ReceiptResultSchema = z.object({
	id: z.string().nonempty("id is required"),
	title: z.string().nonempty("title is required"),
	amount: z.number("amount should be a number"),
	currency: z.string().nonempty("currency is required"),
	vendor: z.string().nullish(),
	boughtAt: z.string().pipe(z.coerce.date()),
	projectId: z.string().nonempty("projectId is required")
});
export type ReceiptResult = z.infer<typeof ReceiptResultSchema>;
export type ReceiptResultInput = z.input<typeof ReceiptResultSchema>;