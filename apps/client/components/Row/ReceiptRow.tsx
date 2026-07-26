import { ReceiptModel } from "@receipts/shared-schemas";

import styles from "./ReceiptRow.module.css";

type ReceiptRowProps = {
    receipt: ReceiptModel;
    onEdit: (receiptId: string) => void;
    onDelete: (receiptId: string) => void;
};

export default function ReceiptRow({
    receipt,
    onEdit,
    onDelete,
}: ReceiptRowProps) {
    return (
        <tr key={receipt.id} className={styles.row}>

            <td className={`${styles.cell} ${styles.actionsCell}`}>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => onEdit(receipt.id)}
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => onDelete(receipt.id)}
                    >
                        🗑️
                    </button>
                </div>
            </td>

            <td className={styles.cell}>{receipt.title}</td>
            <td className={styles.cell}>{receipt.amount}</td>
            <td className={styles.cell}>{receipt.currency}</td>
            <td className={styles.cell}>{receipt.vendor ?? "-"}</td>
            <td className={styles.cell}>
                {new Date(receipt.createdAt).toLocaleDateString()}
            </td>
        </tr>
    );
}