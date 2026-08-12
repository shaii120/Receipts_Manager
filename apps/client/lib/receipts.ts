import { apiFetch } from "./api"
import type {
    ReceiptCreate,
    ReceiptUpdate,
    ReceiptResult
} from "@receipts/shared-schemas/generated";
import type {
    ReceiptMutationResult,
    ReceiptDeleteResult
} from "@receipts/shared-schemas/receipt"

export function getReceipts(projectId: string, router?: any) {
    return apiFetch<ReceiptResult[]>(`/api/receipts/${projectId}`, router = router);
}

export function createReceipt(data: ReceiptCreate) {
    return apiFetch<ReceiptMutationResult>(`/api/receipts`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });
}

export function updateReceipt(receiptId: string, data: ReceiptUpdate) {
    return apiFetch<ReceiptMutationResult>(`/api/receipts/${receiptId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });
}

export function deleteReceipt(receiptId: string) {
    return apiFetch<ReceiptDeleteResult>(`/api/receipts/${receiptId}`, {
        method: 'DELETE',
    });
}