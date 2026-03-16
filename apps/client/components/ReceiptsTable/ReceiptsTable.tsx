"use client";

import { useEffect, useState } from "react";
import { ReceiptModelSchema, type ReceiptModel } from "@receipts/shared-schemas";
import styles from "./ReceiptsTable.module.css";

export default function ReceiptsTable() {
  const [receipts, setReceipts] = useState<ReceiptModel[]>([]);

  useEffect(() => {
    fetch(`/api/receipts`)
      .then((res) => res.json())
      .then((data) => setReceipts(data))
      .catch(console.error);
  }, []);

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.header}>
          <th className={styles.cell}>Title</th>
          <th className={styles.cell}>Amount</th>
          <th className={styles.cell}>Currency</th>
          <th className={styles.cell}>Vendor</th>
        </tr>
      </thead>
      <tbody>
        {receipts.map((rec) => (
          <tr key={rec.id} className={styles.row}>
            <td className={styles.cell}>{rec.title}</td>
            <td className={styles.cell}>{rec.amount}</td>
            <td className={styles.cell}>{rec.currency}</td>
            <td className={styles.cell}>{rec.vendor || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

