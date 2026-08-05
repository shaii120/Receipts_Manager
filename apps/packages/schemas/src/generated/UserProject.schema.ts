import { z } from "zod";
import { ProjectRoleSchema } from "./enums.schema.js";

export const UserProjectModelSchema = z.object({
  userId: z.string().nonempty("userId is required"),
  projectId: z.string().nonempty("projectId is required"),
  role: ProjectRoleSchema
});
export type UserProjectModel = z.infer<typeof UserProjectModelSchema>;
export type UserProjectModelInput = z.input<typeof UserProjectModelSchema>;

export const UserProjectCreateSchema = z.object({
  userId: z.string().nonempty("userId is required"),
  projectId: z.string().nonempty("projectId is required"),
  role: ProjectRoleSchema
});
export type UserProjectCreate = z.infer<typeof UserProjectCreateSchema>;
export type UserProjectCreateInput = z.input<typeof UserProjectCreateSchema>;

export const UserProjectUpdateSchema = z.object({
  role: ProjectRoleSchema.nullish()
});
export type UserProjectUpdate = z.infer<typeof UserProjectUpdateSchema>;
export type UserProjectUpdateInput = z.input<typeof UserProjectUpdateSchema>;

export const UserProjectResultSchema = z.object({
  userId: z.string().nonempty("userId is required"),
  projectId: z.string().nonempty("projectId is required"),
  role: ProjectRoleSchema
});
export type UserProjectResult = z.infer<typeof UserProjectResultSchema>;
export type UserProjectResultInput = z.input<typeof UserProjectResultSchema>;