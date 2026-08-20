
import { z } from "zod";
import {
    ProjectModelSchema,
    ProjectCreateSchema,
    UserProjectModelSchema,
} from "../index.js";
import { UserPublicSchema } from "../auth/index.js"

export const ProjectFormSchema = ProjectCreateSchema
    .omit({
        childProjects: true,
        receipts: true
    })
    .extend({
        users: z.array(
            UserProjectModelSchema.omit({
                projectId: true
            })
        )
    });
export type ProjectFormInput = z.input<typeof ProjectFormSchema>;
export type ProjectForm = z.output<typeof ProjectFormSchema>;

export const ProjectUserSchema = UserProjectModelSchema
    .omit({
        userId: true,
        projectId: true
    })
    .extend({
        user: UserPublicSchema
    });

export const ProjectResultCustomSchema = ProjectModelSchema
    .omit({
        receipts: true,
        users: true,
        childProjects: true
    })
    .extend({
        users: z.array(ProjectUserSchema)
    });
export type ProjectResultCustomInput = z.input<typeof ProjectResultCustomSchema>;
export type ProjectResultCustom = z.infer<typeof ProjectResultCustomSchema>;