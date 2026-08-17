"use client";

import {
    useEffect,
    useState,
    useCallback
} from "react";
import { useRouter } from "next/navigation";

import type { ReceiptModel } from "@receipts/shared-schemas";
import { deleteReceipt, getReceipts } from "@/lib/receipts";
import styles from "./ReceiptsTable.module.css";
import { useProject } from "@/context/ProjectContext";
import ReceiptRow from "@/components/Row/ReceiptRow";
import ReceiptEditRow from "../Row/ReceiptEditRow";

export default function ReceiptsTable() {
    const [receipts, setReceipts] = useState<ReceiptModel[]>([]);
    const [editingReceiptId, setEditingReceiptId] = useState<string | null>(null);
    const router = useRouter();
    const { selectedProjectId, updateProjectTotalAmount } = useProject()
    const reloadReceipts = useCallback(async () => {
        if (!selectedProjectId) {
            setReceipts([]);
            return;
        }

        getReceipts(selectedProjectId, router)
            .then(setReceipts)
            .catch(console.error);
    }, [selectedProjectId, router]);

    async function handleDelete(receiptId: string) {
        if (!confirm("Delete this receipt?")) {
            return;
        }
        if (!selectedProjectId)
            return;

        const result = await deleteReceipt(receiptId);
        updateProjectTotalAmount(selectedProjectId, result.totalAmount)
        await reloadReceipts();
    }

    useEffect(() => {
        reloadReceipts();
    }, [reloadReceipts]);

    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.header}>
                    <th className={styles.cell}></th>
                    <th className={styles.cell}>Title</th>
                    <th className={styles.cell}>Amount</th>
                    <th className={styles.cell}>Currency</th>
                    <th className={styles.cell}>Vendor</th>
                    <th className={styles.cell}>Bought At</th>
                </tr>
            </thead>
            <tbody>
                {receipts.map((rec) => editingReceiptId === rec.id ? (
                    <ReceiptEditRow
                        key={rec.id}
                        receipt={rec}
                        onSaved={async (totalAmount) => {
                            setEditingReceiptId(null);
                            updateProjectTotalAmount(rec.projectId, totalAmount)
                            await reloadReceipts();
                        }}
                        onCancel={() => setEditingReceiptId(null)}
                    />
                ) : (
                    <ReceiptRow
                        key={rec.id}
                        receipt={rec}
                        onEdit={setEditingReceiptId}
                        onDelete={handleDelete}
                    />
                ))}
            </tbody>
        </table>
    );
}

