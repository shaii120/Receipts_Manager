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
    const {
        selectedProject,
        updateProjectTotalAmount
    } = useProject();

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
            currency: selectedProject?.primaryCurrency ?? "USD",
            vendor: null,
            projectId: selectedProject!.id,
            boughtAt: new Date().toISOString().split('T')[0]
        },
    });


    async function onSubmit(data: ReceiptCreate) {
        try {
            const result = await createReceipt(data);

            updateProjectTotalAmount(result.totalAmount)
            reset();
            onAdded?.();
        } catch (err) {
            setError("root", { message: err instanceof Error ? err.message : "Unknown error" });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} key={selectedProject?.id}>
            <div className={styles.fieldsRow}>
                <FormField label="title" placeholder="Title" register={register} errors={errors} />
                <FormField label="amount" placeholder="Amount" type="number" register={register} errors={errors} />
                <CurrencyField name="currency" control={control} />
                <FormField label="vendor" placeholder="Vendor (optional)" register={register} errors={errors} />
                <FormField label="boughtAt" placeholder="Bought At" type="date" register={register} errors={errors} />

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
    const { selectedProject } = useProject()

    if (!selectedProject) {
        return <div>Please select project</div>
    }

    return <AddReceiptForm key={selectedProject.id} onAdded={onAdded} />
}
