"use client";

import { useEffect, useState } from "react";
import styles from "./ReceiptsTable.module.css";
import 'dotenv/config';

type Receipt = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  vendor: string | null;
};
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ReceiptsTable() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/receipts`)
      .then((res) => res.json())
      .then((data) => { setReceipts(data) })
      .catch((err) => console.error(err));
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
        {receipts.map((r) => (
          <tr key={r.id} className={styles.row}>
            <td className={styles.cell}>{r.title}</td>
            <td className={styles.cell}>{r.amount}</td>
            <td className={styles.cell}>{r.currency}</td>
            <td className={styles.cell}>{r.vendor || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
