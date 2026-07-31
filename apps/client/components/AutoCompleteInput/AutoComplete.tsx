"use client";

import {
    ComboBox as AriaComboBox,
    Input,
    ListBox,
    ListBoxItem,
    Popover,
    type Key
} from "react-aria-components";
import { useState, useEffect } from "react"

import styles from "./AutoComplete.module.css"

type ComboBoxProps<T> = {
    items: T[];

    value?: Key | null;
    onChange: (value: Key | null) => void;

    getKey: (item: T) => Key;
    getValue: (item: T) => string;
    getSearchText?: (item: T) => string;

    name?: string;
};

export default function ComboBox<T>({
    items,
    value,
    name,
    onChange,
    getKey,
    getValue,
    getSearchText = getValue
}: ComboBoxProps<T>) {
    const [inputValue, setInputValue] = useState("");
    const filteredItems = items.filter(item =>
        getSearchText(item)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
    );

    function handleValueChange(newValue: Key | null) {
        setInputValue(String(newValue));
        onChange(newValue);
    }

    useEffect(() => {
        setInputValue(String(value))
    }, [items, value, getKey, getValue]);

    return (
        <AriaComboBox
            items={filteredItems}
            value={value}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onChange={handleValueChange}
            aria-label={name}
            className={styles.comboBox}
        >

            <Input placeholder={name} className={styles.input} />

            <Popover className={styles.popover}>
                <ListBox className={styles.listBox}>
                    {(item: T) => (
                        <ListBoxItem
                            id={getKey(item)}
                            className={styles.item}
                        >
                            {getSearchText(item)}
                        </ListBoxItem>
                    )}
                </ListBox>
            </Popover>
        </AriaComboBox>
    );
}