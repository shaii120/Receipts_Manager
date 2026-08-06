"use client";

import {
    Dialog as AriaDialog,
    Modal,
    ModalOverlay
} from "react-aria-components";

import styles from "./Dialog.module.css";

type DialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
};

export default function Dialog({
    open,
    onOpenChange,
    title,
    children
}: DialogProps) {
    return (
        <ModalOverlay
            isOpen={open}
            onOpenChange={onOpenChange}
            className={styles.overlay}
        >
            <Modal className={styles.modal}>
                <AriaDialog
                    aria-label={title}
                    className={styles.dialog}
                >
                    <div className={styles.header}>
                        <h2>{title}</h2>

                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            ×
                        </button>
                    </div>

                    {children}
                </AriaDialog>
            </Modal>
        </ModalOverlay>
    );
}