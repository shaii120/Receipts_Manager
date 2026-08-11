"use client";

import type { ProjectResultCustom } from "@receipts/shared-schemas/project";

import Dialog from "@/components/Dialog/Dialog";
import styles from "./ProjectForm.module.css";

type ViewProjectDialogProps = {
    open: boolean;
    project: ProjectResultCustom;
    onClose: () => void;
};

export default function ViewProjectDialog({
    open,
    project,
    onClose
}: ViewProjectDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose();
                }
            }}
            title="Project Details"
        >
            <dl className={styles.details}>
                <div className={styles.field}>
                    <dt className={styles.label}>Name</dt>
                    <dd>{project.name}</dd>
                </div>

                <div className={styles.field}>
                    <dt className={styles.label}>Description</dt>
                    <dd>{project.description ?? "No description"}</dd>
                </div>

                <div className={styles.field}>
                    <dt className={styles.label}>Primary currency</dt>
                    <dd>{project.primaryCurrency}</dd>
                </div>

                <div className={styles.field}>
                    <dt className={styles.label}>Total amount</dt>
                    <dd>{project.totalAmount}</dd>
                </div>

                <div className={styles.field}>
                    <dt className={styles.label}>Users</dt>
                    <dd className={styles.users}>
                        {project.users.map(projectUser => (
                            <div
                                key={projectUser.user.id}
                                className={styles.user}
                            >
                                <span>{projectUser.user.email}</span>
                                <span>{projectUser.role}</span>
                            </div>
                        ))}
                    </dd>
                </div>
            </dl>
        </Dialog>
    );
}