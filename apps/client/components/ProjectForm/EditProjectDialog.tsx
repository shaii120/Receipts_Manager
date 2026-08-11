"use client";

import type { ProjectResult, UserProjectModel } from "@receipts/shared-schemas/generated";
import type { ProjectForm as ProjectFormType, ProjectResultCustom } from "@receipts/shared-schemas/project";

import { updateProject } from "@/lib/projects";
import { useAuth } from "@/context/AuthContext";
import Dialog from "@/components/Dialog/Dialog";
import ProjectForm from "./ProjectForm";

type EditProjectDialogProps = {
    open: boolean;
    project: ProjectResultCustom;
    onClose: () => void;
    onUpdated: (project: ProjectResult) => void;
};

export default function EditProjectDialog({
    open,
    project,
    onClose,
    onUpdated
}: EditProjectDialogProps) {
    const { user } = useAuth();
    const users = project.users
        .map(projectUser => projectUser.user)
        .filter(projectUser => projectUser.id !== user?.id);

    async function handleSubmit(data: ProjectFormType) {
        if (!user) return;

        const updatedUsers: UserProjectModel[] = data.usersId.map(selectedUser => ({
            ...selectedUser,
            projectId: project.id
        }))
        updatedUsers.push({
            userId: user.id,
            projectId: project.id,
            role: "OWNER"
        })
        const updatedProject = await updateProject(project.id, {
            name: data.name,
            description: data.description,
            primaryCurrency: data.primaryCurrency,
            usersId: updatedUsers
        });

        onUpdated(updatedProject);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose();
                }
            }}
            title="Edit Project"
        >
            <ProjectForm
                defaultValues={{
                    name: project.name,
                    description: project.description,
                    primaryCurrency: project.primaryCurrency,
                    receiptsId: [],
                    usersId: []
                }}
                defaultUsers={users}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Dialog>
    );
}