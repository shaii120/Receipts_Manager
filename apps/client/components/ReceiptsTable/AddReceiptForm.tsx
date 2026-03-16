"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptCreateSchema, type ReceiptCreate } from "@receipts/shared-schemas";
import styles from "./ReceiptsTable.module.css";

type FormFieldProps = {
    label: string;
    placeholder: string;
    type?: string;
    register: any;
};

const FormField = ({ placeholder, type = "text", register, label, errors }: FormFieldProps & { errors: any }) => {
    const registerOptions = (type === "number") ? { valueAsNumber: true } : {};
    const stepAttr = (type === "number") ? { step: "any" } : {};

    return (
        <div className={styles.formField}>
            <input
                className={styles.input}
                placeholder={placeholder}
                type={type}
                {...stepAttr}
                {...register(label, registerOptions)}
            />
            <div className={styles.error}>
                {errors[label] ? String(errors[label]?.message) : ''}
            </div>
        </div>
    );
};

export default function AddReceiptForm({ onAdded }: { onAdded?: () => void }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError
    } = useForm<ReceiptCreate>({
        resolver: zodResolver(ReceiptCreateSchema),
        defaultValues: { title: "", amount: 0, currency: "USD", vendor: null as any },
    });

    const onSubmit: SubmitHandler<ReceiptCreate> = async (data: ReceiptCreate) => {
        try {
            const res = await fetch(`/api/receipts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error((await res.json())?.error || "Failed");
            reset();
            onAdded?.();
        } catch (err) {
            setError("root", { message: err instanceof Error ? err.message : "Unknown error" });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.fieldsRow}>
                <FormField label="title" placeholder="Title" register={register} errors={errors} />
                <FormField label="amount" placeholder="Amount" type="number" register={register} errors={errors} />
                <FormField label="currency" placeholder="Currency" register={register} errors={errors} />
                <FormField label="vendor" placeholder="Vendor (optional)" register={register} errors={errors} />

                <button className={styles.button} disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Adding..." : "Add Receipt"}
                </button>
            </div>


            {Object.keys(errors).some(k => k !== "root") && (
                <div className={styles.rootError}>Please check all fields</div>
            )}
        </form>
    );
}
