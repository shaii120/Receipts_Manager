"use client";

import { useState } from "react";
import styles from "./ReceiptsTable.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
    onAdded?: () => void;
};

export default function AddReceiptForm({ onAdded }: Props) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState("USD");
    const [vendor, setVendor] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const payload = { title, amount, currency, vendor: vendor || null };
            const res = await fetch(`${BASE_URL}/receipts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error || "Failed to create receipt");
            }
            setTitle("");
            setAmount(0);
            setCurrency("USD");
            setVendor("");
            onAdded && onAdded();
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
            <input
                className={styles.input}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                className={styles.input}
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
            />
            <input
                className={styles.input}
                placeholder="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
            />
            <input
                className={styles.input}
                placeholder="Vendor (optional)"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
            />
            <button className={styles.button} disabled={saving} type="submit">
                {saving ? "Adding..." : "Add Receipt"}
            </button>
            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
}
