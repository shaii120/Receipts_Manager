"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    ReceiptCreateSchema,
    type ReceiptCreate,
    type ReceiptCreateInput,
    type ReceiptModel,
} from "@receipts/shared-schemas";
import { updateReceipt } from "@/lib/receipts";
import AutoComplete from "@/components/AutoCompleteInput/AutoComplete"
import { useCurrencies } from "@/context/CurrencyContext"
import styles from "./ReceiptRow.module.css";

type ReceiptEditRowProps = {
    receipt: ReceiptModel;
    onSaved: () => void;
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
            createdAt: new Date(receipt.createdAt)
                .toISOString()
                .split("T")[0],
            projectId: receipt.projectId,
        },
    });

    async function onSubmit(data: ReceiptCreate) {
        try {
            await updateReceipt(receipt.id, data);
            onSaved();
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
                <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                        <AutoComplete
                            name="Currency"
                            items={useCurrencies()}
                            value={field.value}
                            onChange={field.onChange}
                            getKey={(currnecy) => currnecy.code}
                            getValue={(currnecy) => currnecy.name}
                            getSearchText={(currency) => `${currency.code} - ${currency.name}`}
                        />
                    )}
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
                    {...register("createdAt")}
                />
            </td>
        </tr>
    );
}