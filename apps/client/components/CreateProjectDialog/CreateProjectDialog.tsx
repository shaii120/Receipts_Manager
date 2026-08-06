"use client";

import {
    useForm
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import type {
    ProjectResult
} from "@receipts/shared-schemas/generated";
import {
    ProjectCreateFormSchema,
    type ProjectCreateForm,
    type ProjectCreateFormInput
} from "@receipts/shared-schemas/project"
import type { UserPublic } from "@receipts/shared-schemas/auth";
import { createProject } from "@/lib/projects";
import Dialog from "@/components/Dialog/Dialog";
import CurrencyField from "@/components/CurrencyField/CurrencyField";
import UserPicker from "@/components/UserPicker/UserPicker";
import styles from "./CreateProjectDialog.module.css";

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
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<ProjectCreateFormInput, any, ProjectCreateForm>({
        resolver: zodResolver(ProjectCreateFormSchema),
        defaultValues: {
            name: "",
            description: null,
            primaryCurrency: "USD",
            receiptsId: [],
            usersId: []
        }
    });
    const [selectedUsers, setSelectedUsers] = useState<UserPublic[]>([]);

    function resetAll() {
        reset();
        setSelectedUsers([]);
    }

    async function onSubmit(data: ProjectCreateForm) {
        try {
            data.usersId = selectedUsers.map(user => ({
                userId: user.id,
                role: "EDITOR"
            }));
            const project = await createProject(data);

            resetAll();
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
                    resetAll();
                    onClose();
                }
            }}
            title="Create Project"
        >
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.field}>
                    <input
                        className={styles.input}
                        placeholder="Project name"
                        {...register("name")}
                    />
                </div>

                <div className={styles.field}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Description"
                        {...register("description")}
                    />
                </div>

                <div className={styles.field}>
                    <label>Primary currency</label>
                    <CurrencyField
                        control={control}
                        name="primaryCurrency"
                    />
                </div>

                <div className={styles.field}>
                    <label>Users</label>
                    <UserPicker
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => {
                            resetAll();
                            onClose();
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </Dialog>
    );
}