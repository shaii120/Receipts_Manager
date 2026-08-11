"use client";

import type {
    ProjectResult
} from "@receipts/shared-schemas/generated";
import {
    type ProjectForm as ProjectFormType,
} from "@receipts/shared-schemas/project"
import { createProject } from "@/lib/projects";
import Dialog from "@/components/Dialog/Dialog";
import ProjectForm from "./ProjectForm";

type CreateProjectDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreated: (project: ProjectResult) => void;
};

export default function CreateProjectDialog({
    open,
    onClose,
    onCreated
}: CreateProjectDialogProps) {

    async function handleCreate(data: ProjectFormType) {
        try {
            const project = await createProject(data);

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