import { z } from "zod";
import { ReceiptModelSchema } from "./Receipt.schema.js";
import { UserProjectModelSchema } from "./UserProject.schema.js";

export const ProjectModelSchema = z.object({
  id: z.string().nonempty("id is required"),
  name: z.string().nonempty("name is required"),
  description: z.string().nullish(),
  primaryCurrency: z.string().nonempty("primaryCurrency is required"),
  totalAmount: z.number(),
  receiptsId: z.array(ReceiptModelSchema),
  usersId: z.array(UserProjectModelSchema)
});
export type ProjectModel = z.infer<typeof ProjectModelSchema>;
export type ProjectModelInput = z.input<typeof ProjectModelSchema>;

export const ProjectCreateSchema = z.object({
  name: z.string().nonempty("name is required"),
  description: z.string().nullish(),
  primaryCurrency: z.string().nonempty("primaryCurrency is required"),
  receiptsId: z.array(ReceiptModelSchema),
  usersId: z.array(UserProjectModelSchema)
});
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectCreateInput = z.input<typeof ProjectCreateSchema>;

export const ProjectUpdateSchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish(),
  primaryCurrency: z.string().nullish(),
  totalAmount: z.number().nullish(),
  receiptsId: z.array(ReceiptModelSchema).nullish(),
  usersId: z.array(UserProjectModelSchema).nullish()
});
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ProjectUpdateInput = z.input<typeof ProjectUpdateSchema>;

export const ProjectResultSchema = z.object({
  id: z.string().nonempty("id is required"),
  name: z.string().nonempty("name is required"),
  description: z.string().nullish(),
  primaryCurrency: z.string().nonempty("primaryCurrency is required"),
  totalAmount: z.number()
});
export type ProjectResult = z.infer<typeof ProjectResultSchema>;
export type ProjectResultInput = z.input<typeof ProjectResultSchema>;