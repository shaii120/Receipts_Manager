"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ReceiptCreateSchema } from "@receipts/shared-schemas";
import type { ReceiptCreate, ReceiptCreateInput } from "@receipts/shared-schemas";
import { createReceipt } from "@/lib/receipts"
import { useProject } from "@/context/ProjectContext";
import CurrencyField from "@/components/CurrencyField/CurrencyField";
import styles from "./ReceiptsTable.module.css";


type FormFieldProps = {
    label: string;
    placeholder: string;
    type?: string;
    register: any;
    optional?: any;
};

function FormField({ placeholder, type = "text", register, label, errors, optional = {} }: FormFieldProps & { errors: any }) {
    const registerOptions = new Map<string, any>([
        ["number", { valueAsNumber: true }]
    ]);
    const stepAttr = (type === "number") ? { step: "any" } : {};

    return (
        <div className={styles.formField}>
            <input
                className={styles.input}
                placeholder={placeholder}
                type={type}
                {...stepAttr}
                {...register(label, registerOptions.get(type))}
                {...optional}
            />
            <div className={styles.error}>
                {errors[label] ? String(errors[label]?.message) : ''}
            </div>
        </div>
    );
};

function AddReceiptForm({ onAdded }: { onAdded?: () => void }) {
    const { selectedProjectId, projects } = useProject();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
        setError
    } = useForm<ReceiptCreateInput, any, ReceiptCreate>({
        resolver: zodResolver(ReceiptCreateSchema),
        defaultValues: {
            title: "",
            amount: 0,
            currency: "USD",
            vendor: null,
            projectId: selectedProjectId!,
            boughtAt: new Date().toISOString().split('T')[0]
        },
    });


    async function onSubmit(data: ReceiptCreate) {
        try {
            await createReceipt(data);

            reset();
            onAdded?.();
        } catch (err) {
            setError("root", { message: err instanceof Error ? err.message : "Unknown error" });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} key={selectedProjectId}>
            <div className={styles.fieldsRow}>
                <FormField label="title" placeholder="Title" register={register} errors={errors} />
                <FormField label="amount" placeholder="Amount" type="number" register={register} errors={errors} />
                <CurrencyField
                    name="currency"
                    control={control}
                />
                <FormField label="vendor" placeholder="Vendor (optional)" register={register} errors={errors} />
                <FormField label="boughtAt" placeholder="Bought At" type="date" register={register} errors={errors} />
                <select className={styles.input} {...register("projectId")}>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <button className={styles.button} disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Adding..." : "Add Receipt"}
                </button>
            </div>


            {
                Object.keys(errors).some(k => k !== "root") && (
                    <div className={styles.rootError}>Please check all fields</div>
                )
            }
        </form >
    );
}

export default function AddReceiptFormWrapper({ onAdded }: { onAdded?: () => void }) {
    const { selectedProjectId } = useProject()

    if (!selectedProjectId) {
        return <div>Please select project</div>
    }

    return <AddReceiptForm key={selectedProjectId} onAdded={onAdded} />
}
