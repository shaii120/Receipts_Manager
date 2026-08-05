import { z } from "zod";
import { UserProjectModelSchema } from "./UserProject.schema.js";

export const UserModelSchema = z.object({
  id: z.string().nonempty("id is required"),
  email: z.string().nonempty("email is required"),
  passwordHash: z.string().nonempty("passwordHash is required"),
  projectsId: z.array(UserProjectModelSchema)
});
export type UserModel = z.infer<typeof UserModelSchema>;
export type UserModelInput = z.input<typeof UserModelSchema>;

export const UserCreateSchema = z.object({
  email: z.string().nonempty("email is required"),
  passwordHash: z.string().nonempty("passwordHash is required"),
  projectsId: z.array(UserProjectModelSchema)
});
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserCreateInput = z.input<typeof UserCreateSchema>;

export const UserUpdateSchema = z.object({
  email: z.string().nullish(),
  passwordHash: z.string().nullish(),
  projectsId: z.array(UserProjectModelSchema).nullish()
});
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserUpdateInput = z.input<typeof UserUpdateSchema>;

export const UserResultSchema = z.object({
  id: z.string().nonempty("id is required"),
  email: z.string().nonempty("email is required"),
  passwordHash: z.string().nonempty("passwordHash is required")
});
export type UserResult = z.infer<typeof UserResultSchema>;
export type UserResultInput = z.input<typeof UserResultSchema>;