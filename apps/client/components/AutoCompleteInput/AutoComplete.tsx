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

    inputValue?: string;
    onInputChange?: (value: string) => void;

    getKey: (item: T) => Key;
    getValue: (item: T) => string;
    getDisplayValue?: (item: T) => string;
    getSearchText?: (item: T) => string;

    name?: string;
};

export default function ComboBox<T>(props: ComboBoxProps<T>) {
    const [internalInputValue, setInternalInputValue] = useState("");
    const currentInputValue = props.inputValue ?? internalInputValue;
    const updateInputValue = props.onInputChange ?? setInternalInputValue;
    const getDisplayValue = props.getDisplayValue ?? props.getValue;
    const getSearchText = props.getSearchText ?? props.getValue;

    const filteredItems = props.items.filter(item =>
        getSearchText(item)
            .toLowerCase()
            .includes(currentInputValue.toLowerCase())
    );

    function handleValueChange(newValue: Key | null) {
        const item = props.items.find(item => props.getKey(item) === newValue);

        if (item) {
            updateInputValue(getDisplayValue(item));
        } else {
            updateInputValue("");
        }

        props.onChange(newValue);
    }

    useEffect(() => {
        if (!props.value) {
            updateInputValue("");
        }
        else {
            const item = props.items.find(item => props.getKey(item) === props.value);
            updateInputValue(item ? getDisplayValue(item) : "");
        }
    }, [props.value]);

    return (
        <AriaComboBox
            items={filteredItems}
            value={props.value}
            inputValue={currentInputValue}
            onInputChange={updateInputValue}
            onChange={handleValueChange}
            aria-label={props.name}
            className={styles.comboBox}
            allowsEmptyCollection
        >

            <Input placeholder={props.name} className={styles.input} />

            <Popover className={styles.popover}>
                <ListBox className={styles.listBox}>
                    {(item: T) => (
                        <ListBoxItem
                            id={props.getKey(item)}
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