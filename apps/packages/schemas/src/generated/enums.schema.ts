import { z } from "zod";

export const ProjectRoleSchema = z.enum(["OWNER", "EDITOR", "VIEWER"]);
export type ProjectRole = z.infer<typeof ProjectRoleSchema>;

