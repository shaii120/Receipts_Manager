import { z } from "zod";

export const UserProjectModelSchema = z.object({
  userId: z.string().nonempty("userId is required"),
  projectId: z.string().nonempty("projectId is required")
});
export type UserProjectModel = z.infer<typeof UserProjectModelSchema>;

export const UserProjectCreateSchema = z.object({
  userId: z.string().nonempty("userId is required"),
  projectId: z.string().nonempty("projectId is required")
});
export type UserProjectCreate = z.infer<typeof UserProjectCreateSchema>;

export const UserProjectResultSchema = z.object({
  userId: z.string().nonempty("userId is required"),
  projectId: z.string().nonempty("projectId is required")
});
export type UserProjectResult = z.infer<typeof UserProjectResultSchema>;