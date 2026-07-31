import { z } from "zod";
import type { Currency } from "@receipts/shared-schemas/currency"

const FRANKFURTER_URL = "https://api.frankfurter.dev/v1/currencies";

const CurrencySchema = z.record(z.string(), z.string());


let currenciesCache: Currency[] | null = null;

export async function getCurrencies(): Promise<Currency[]> {
    if (currenciesCache) {
        return currenciesCache;
    }

    const response = await fetch(FRANKFURTER_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch currencies");
    }

    const data = CurrencySchema.parse(await response.json());

    currenciesCache = Object.entries(data).map(([code, name]) => ({
        code,
        name
    }));

    return currenciesCache;
}