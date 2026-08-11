
import { z } from "zod";
import {
    ProjectModelSchema,
    ProjectCreateSchema,
    UserProjectModelSchema,
} from "../index.js";
import { UserPublicSchema } from "../auth/index.js"

export const ProjectFormSchema = ProjectCreateSchema.extend({
    usersId: z.array(
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
        receiptsId: true,
        usersId: true
    })
    .extend({
        users: z.array(ProjectUserSchema)
    });
export type ProjectResultCustomInput = z.input<typeof ProjectResultCustomSchema>;
export type ProjectResultCustom = z.infer<typeof ProjectResultCustomSchema>;