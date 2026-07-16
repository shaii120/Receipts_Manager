"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type ReceiptModel } from "@receipts/shared-schemas";
import { getReceipts } from "@/lib/receipts";
import styles from "./ReceiptsTable.module.css";
import { useProject } from "@/context/ProjectContext";

export default function ReceiptsTable() {
    const [receipts, setReceipts] = useState<ReceiptModel[]>([]);
    const router = useRouter();
    const { selectedProjectId } = useProject()

    useEffect(() => {
        if (selectedProjectId) {
            getReceipts(selectedProjectId, router)
                .then((data) => setReceipts(data))
                .catch(console.error);
        }
    }, [selectedProjectId]);
    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.header}>
                    <th className={styles.cell}>Title</th>
                    <th className={styles.cell}>Amount</th>
                    <th className={styles.cell}>Currency</th>
                    <th className={styles.cell}>Vendor</th>
                    <th className={styles.cell}>Created At</th>
                </tr>
            </thead>
            <tbody>
                {receipts.map((rec) => (
                    <tr key={rec.id} className={styles.row}>
                        <td className={styles.cell}>{rec.title}</td>
                        <td className={styles.cell}>{rec.amount}</td>
                        <td className={styles.cell}>{rec.currency}</td>
                        <td className={styles.cell}>{rec.vendor || "-"}</td>
                        <td className={styles.cell}>{new Date(rec.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

