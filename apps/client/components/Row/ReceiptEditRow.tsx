"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ReceiptCreateSchema } from "@receipts/shared-schemas";
import type {
    ReceiptCreate,
    ReceiptCreateInput,
    ReceiptModel
} from "@receipts/shared-schemas";
import { updateReceipt } from "@/lib/receipts";
import CurrencyField from "@/components/CurrencyField/CurrencyField";
import styles from "./ReceiptRow.module.css";

type ReceiptEditRowProps = {
    receipt: ReceiptModel;
    onSaved: (totalAmount: number) => void;
    onCancel: () => void;
};

export default function ReceiptEditRow({
    receipt,
    onSaved,
    onCancel,
}: ReceiptEditRowProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<ReceiptCreateInput, any, ReceiptCreate>({
        resolver: zodResolver(ReceiptCreateSchema),
        defaultValues: {
            title: receipt.title,
            amount: receipt.amount,
            currency: receipt.currency,
            vendor: receipt.vendor,
            boughtAt: new Date(receipt.boughtAt)
                .toISOString()
                .split("T")[0],
            projectId: receipt.projectId,
        },
    });

    async function onSubmit(data: ReceiptCreate) {
        try {
            const result = await updateReceipt(receipt.id, data);
            onSaved(result.totalAmount);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <tr className={styles.row}>
            <td className={`${styles.cell} ${styles.actionsCell}`}>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        ✔
                    </button>

                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        ✖
                    </button>
                </div>
            </td>

            <td className={styles.cell}>
                <input
                    className={styles.input}
                    {...register("title")}
                />
            </td>

            <td className={styles.cell}>
                <input
                    className={styles.input}
                    type="number"
                    step="any"
                    {...register("amount", {
                        valueAsNumber: true,
                    })}
                />
            </td>

            <td className={styles.cell}>
                <CurrencyField
                    name="currency"
                    control={control}
                />
            </td>

            <td className={styles.cell}>
                <input
                    className={styles.input}
                    {...register("vendor")}
                />
            </td>

            <td className={styles.cell}>
                <input
                    className={styles.input}
                    type="date"
                    {...register("boughtAt")}
                />
            </td>
        </tr>
    );
}