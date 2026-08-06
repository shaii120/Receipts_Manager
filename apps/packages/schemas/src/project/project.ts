
import { z } from "zod";
import {
    ProjectCreateSchema,
    UserProjectModelSchema
} from "../index.js";

export const ProjectCreateFormSchema = ProjectCreateSchema.extend({
    usersId: z.array(
        UserProjectModelSchema.omit({
            projectId: true
        })
    )
});
export type ProjectCreateFormInput = z.input<typeof ProjectCreateFormSchema>;
export type ProjectCreateForm = z.output<typeof ProjectCreateFormSchema>;