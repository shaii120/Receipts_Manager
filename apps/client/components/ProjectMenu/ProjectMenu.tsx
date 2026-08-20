"use client";

import { useState } from "react";

import type { ProjectResultCustom } from "@receipts/shared-schemas/project";

import { getReceipts } from "@/lib/receipts";
import { exportReceipts } from "@/lib/receiptsExport";
import { deleteProject } from "@/lib/projects";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import ActionsMenu from "@/components/ActionsMenu/ActionsMenu";
import EditProjectDialog from "@/components/ProjectForm/EditProjectDialog";
import ViewProjectDialog from "@/components/ProjectForm/ViewProjectDialog";

type ProjectMenuProps = {
    project: ProjectResultCustom;
};

type ProjectAction = "view" | "edit" | "delete" | "export";

const actionLabels: Record<ProjectAction, string> = {
    view: "View",
    edit: "Edit",
    delete: "Delete",
    export: "Export to CSV"
};

export default function ProjectMenu({
    project
}: ProjectMenuProps) {
    const { user } = useAuth();
    const {
        selectedProject,
        selectProject,
        refreshProjects,
        goBack
    } = useProject();

    const [viewing, setViewing] = useState(false);
    const [editing, setEditing] = useState(false);

    const projectUser = project.users.find(
        projectUser => projectUser.user.id === user?.id
    );

    const isOwner = projectUser?.role === "OWNER";

    const actions: ProjectAction[] = ["view", "export"];

    if (isOwner) {
        actions.push("edit", "delete");
    }

    const actionHandlers: Record<ProjectAction, () => void> = {
        view: () => setViewing(true),
        edit: () => setEditing(true),
        delete: async () => {
            const confirmed = window.confirm(
                `Are you sure you want to delete "${project.name}"?`
            );

            if (!confirmed) return;


            if (selectedProject?.id === project.id)
                await selectProject(null)
            await deleteProject(project.id);
            const projects = await refreshProjects();
            if (projects?.length === 0)
                await goBack();
        },
        export: async () => {
            const receipts = await getReceipts(project.id);
            exportReceipts(receipts, project.name);
        },
    };

    return (
        <>
            <ActionsMenu
                label={`Actions for ${project.name}`}
                actions={actions.map(action => ({
                    key: action,
                    label: actionLabels[action],
                    onAction: actionHandlers[action]
                }))}
            />

            <ViewProjectDialog
                open={viewing}
                project={project}
                onClose={() => setViewing(false)}
            />

            <EditProjectDialog
                open={editing}
                project={project}
                onClose={() => setEditing(false)}
                onUpdated={() => {
                    setEditing(false);
                    refreshProjects();
                }}
            />
        </>
    );
}