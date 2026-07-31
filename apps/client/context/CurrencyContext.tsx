import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Currency } from "@receipts/shared-schemas/currency"
import { getCurrencies } from "@/lib/currencies"

const CurrencyContext = createContext<Currency[]>([]);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    useEffect(() => {
        getCurrencies().then(setCurrencies);
    }, []);

    return (
        <CurrencyContext.Provider value={currencies}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrencies() {
    return useContext(CurrencyContext);
}