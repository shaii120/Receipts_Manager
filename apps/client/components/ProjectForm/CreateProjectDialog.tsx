"use client";

import type {
    ProjectResultCustom
} from "@receipts/shared-schemas/project";
import type {
    ProjectForm as ProjectFormType,
} from "@receipts/shared-schemas/project"
import { useProject } from "@/context/ProjectContext";
import { createProject } from "@/lib/projects";
import Dialog from "@/components/Dialog/Dialog";
import ProjectForm from "./ProjectForm";

type CreateProjectDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreated: (project: ProjectResultCustom) => void;
};

export default function CreateProjectDialog({
    open,
    onClose,
    onCreated
}: CreateProjectDialogProps) {
    const { selectedProject } = useProject();

    async function handleCreate(data: ProjectFormType) {
        try {
            const project = await createProject({
                ...data,
                parentProjectId: selectedProject?.id
            });

            onCreated(project);
            onClose();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose();
                }
            }}
            title="Create Project"
        >
            <ProjectForm
                onSubmit={handleCreate}
                onCancel={onClose}
            />
        </Dialog>
    );
}