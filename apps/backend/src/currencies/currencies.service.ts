import { z } from "zod";
import type { Currency } from "@receipts/shared-schemas/currency"

const FRANKFURTER_URL_CURRENCIES = "https://api.frankfurter.dev/v1/currencies";
const FRANKFURTER_RATE_URL = "https://api.frankfurter.dev/v2/rate";

const CurrencySchema = z.record(z.string(), z.string());


let currenciesCache: Currency[] | null = null;

export async function getCurrencies(): Promise<Currency[]> {
    if (currenciesCache) {
        return currenciesCache;
    }

    const response = await fetch(FRANKFURTER_URL_CURRENCIES);

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

export async function getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    date: Date
): Promise<number> {
    if (fromCurrency === toCurrency) {
        return 1;
    }

    const dateString = date.toISOString().split("T")[0];

    const response = await fetch(
        `${FRANKFURTER_RATE_URL}/${fromCurrency}/${toCurrency}?date=${dateString}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();

    if (typeof data.rate !== "number") {
        throw new Error("Exchange rate not found");
    }

    return data.rate;
}