"use client";

import { Controller } from "react-hook-form";
import type {
    Control,
    FieldValues,
    Path
} from "react-hook-form"

import { useCurrencies } from "@/context/CurrencyContext";
import AutoComplete from "@/components/AutoCompleteInput/AutoComplete";

type CurrencyFieldProps<
    TFieldValues extends FieldValues,
    TTransformedValues extends FieldValues = TFieldValues
> = {
    control: Control<TFieldValues, any, TTransformedValues>;
    name: Path<TFieldValues>;
};

export default function CurrencyField<
    TFieldValues extends FieldValues,
    TTransformedValues extends FieldValues = TFieldValues
>({
    control,
    name
}: CurrencyFieldProps<TFieldValues, TTransformedValues>) {
    const currencies = useCurrencies();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <AutoComplete
                    name="Currency"
                    items={currencies}
                    value={field.value}
                    onChange={field.onChange}
                    getKey={(currency) => currency.code}
                    getValue={(currency) => currency.name}
                    getSearchText={(currency) =>
                        `${currency.code} - ${currency.name}`
                    }
                    getDisplayValue={(currency) => currency.code}
                />
            )}
        />
    );
}