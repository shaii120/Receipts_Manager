import { z } from "zod";
import { ReceiptModelSchema } from "./Receipt.schema.js";
import { UserProjectModelSchema } from "./UserProject.schema.js";

export const ProjectModelSchema = z.object({
	id: z.string().nonempty("id is required"),
	name: z.string().nonempty("name is required"),
	description: z.string().nullish(),
	primaryCurrency: z.string().nonempty("primaryCurrency is required"),
	totalAmount: z.number("totalAmount should be a number"),
	parentProjectId: z.string().nullish(),
	receipts: z.array(ReceiptModelSchema),
	users: z.array(UserProjectModelSchema),
	get childProjects(){ return z.array(ProjectModelSchema) }
});
export type ProjectModel = z.infer<typeof ProjectModelSchema>;
export type ProjectModelInput = z.input<typeof ProjectModelSchema>;

export const ProjectCreateSchema = z.object({
	name: z.string().nonempty("name is required"),
	description: z.string().nullish(),
	primaryCurrency: z.string().nonempty("primaryCurrency is required"),
	parentProjectId: z.string().nullish(),
	receipts: z.array(ReceiptModelSchema),
	users: z.array(UserProjectModelSchema),
	childProjects: z.array(ProjectModelSchema)
});
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectCreateInput = z.input<typeof ProjectCreateSchema>;

export const ProjectUpdateSchema = z.object({
	name: z.string().nullish(),
	description: z.string().nullish(),
	primaryCurrency: z.string().nullish(),
	totalAmount: z.number("totalAmount should be a number").nullish(),
	receipts: z.array(ReceiptModelSchema).nullish(),
	users: z.array(UserProjectModelSchema).nullish(),
	childProjects: z.array(ProjectModelSchema).nullish()
});
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ProjectUpdateInput = z.input<typeof ProjectUpdateSchema>;

export const ProjectResultSchema = z.object({
	id: z.string().nonempty("id is required"),
	name: z.string().nonempty("name is required"),
	description: z.string().nullish(),
	primaryCurrency: z.string().nonempty("primaryCurrency is required"),
	totalAmount: z.number("totalAmount should be a number"),
	parentProjectId: z.string().nullish()
});
export type ProjectResult = z.infer<typeof ProjectResultSchema>;
export type ProjectResultInput = z.input<typeof ProjectResultSchema>;