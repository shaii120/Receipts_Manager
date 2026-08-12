import type { ReceiptResult } from "@receipts/shared-schemas/generated";

function escapeCsvValue(value: string | number): string {
    return `"${String(value).replace(/"/g, '""')}"`;
}

export function exportReceipts(receipts: ReceiptResult[], fileName: string) {
    const headers: string[] = [
        "Title",
        "Amount",
        "Currency",
        "Vendor",
        "Bought At"
    ];

    const rows = receipts.map(receipt => [
        receipt.title,
        receipt.amount,
        receipt.currency,
        receipt.vendor ?? "-",
        new Date(receipt.boughtAt).toISOString().split("T")[0]
    ]);

    const csv = [
        headers.map(escapeCsvValue).join(","),
        ...rows.map(row => row.map(escapeCsvValue).join(","))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}