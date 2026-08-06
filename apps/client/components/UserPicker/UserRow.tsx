"use client";

import type { UserPublic } from "@receipts/shared-schemas/auth";
import styles from "./UserPicker.module.css";

type UserRowProps = {
    user: UserPublic;
    onRemove: (id: string) => void;
};

export default function UserRow({
    user,
    onRemove
}: UserRowProps) {
    return (
        <div className={styles.userRow}>
            <span>{user.email}</span>

            <button
                type="button"
                onClick={() => onRemove(user.id)}
                className={styles.removeButton}
            >
                ×
            </button>
        </div>
    );
}