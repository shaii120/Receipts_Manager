import { apiFetch } from "./api";
import type { Currency } from "@receipts/shared-schemas/currency";

export function getCurrencies() {
    return apiFetch<Currency[]>("/api/currencies");
}