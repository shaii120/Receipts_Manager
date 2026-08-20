"use client";

import {
    useForm
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
    ProjectFormSchema,
    type ProjectForm,
    type ProjectFormInput
} from "@receipts/shared-schemas/project";
import type { UserPublic } from "@receipts/shared-schemas/auth";
import { useProject } from "@/context/ProjectContext"
import CurrencyField from "@/components/CurrencyField/CurrencyField";
import UserPicker from "@/components/UserPicker/UserPicker";
import styles from "./ProjectForm.module.css";

type ProjectFormProps = {
    defaultValues?: ProjectFormInput;
    defaultUsers?: UserPublic[];
    onSubmit: (data: ProjectForm) => Promise<void>;
    onCancel: () => void;
};

export default function ProjectForm({
    defaultValues,
    defaultUsers = [],
    onSubmit,
    onCancel
}: ProjectFormProps) {
    const { selectedProject } = useProject()
    const emptyProject: ProjectFormInput = {
        name: "",
        description: null,
        primaryCurrency: selectedProject ? selectedProject.primaryCurrency : "USD",
        users: []
    };
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<ProjectFormInput, any, ProjectForm>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues: defaultValues ?? emptyProject
    });

    const [selectedUsers, setSelectedUsers] = useState<UserPublic[]>(defaultUsers);

    function resetAll() {
        reset();
        setSelectedUsers([]);
    }

    async function handleFormSubmit(data: ProjectForm) {
        data.users = selectedUsers.map(user => ({
            userId: user.id,
            role: "EDITOR"
        }));

        await onSubmit(data);
        resetAll();
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(handleFormSubmit)}
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
                        onCancel();
                    }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}