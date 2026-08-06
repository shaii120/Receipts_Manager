"use client";

import {
    useEffect,
    useState,
    useRef
} from "react";
import type { Key } from "react-aria-components";
import type { UserPublic } from "@receipts/shared-schemas/auth";
import AutoComplete from "@/components/AutoCompleteInput/AutoComplete";
import { searchUsers } from "@/lib/users";
import UserRow from "./UserRow";
import styles from "./UserPicker.module.css";

type UserPickerProps = {
    value: UserPublic[];
    onChange: (users: UserPublic[]) => void;
};

export default function UserPicker({
    value,
    onChange
}: UserPickerProps) {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<UserPublic[]>([]);
    const throttleMs = 300;
    const lastSearchTime = useRef(0);
    const pendingSearch = useRef<NodeJS.Timeout | null>(null);
    const latestSearchText = useRef("");

    const availableResults = results.filter(
        user => !value.some(selected => selected.id === user.id)
    );

    async function runSearch() {
        lastSearchTime.current = Date.now();

        try {
            const users = await searchUsers(latestSearchText.current);
            setResults(users ?? []);
        }
        catch (err) {
            console.error(err);
            setResults([]);
        }
    }

    useEffect(() => {
        if (searchText.length < 2) {
            setResults([]);
            return;
        }

        latestSearchText.current = searchText;
        const elapsed = Date.now() - lastSearchTime.current;

        if (elapsed >= throttleMs) {
            runSearch();
        }
        else if (pendingSearch.current) {
            clearTimeout(pendingSearch.current);
        }

        pendingSearch.current = setTimeout(() => {
            runSearch();
        }, throttleMs - elapsed);


        return () => {
            if (pendingSearch.current) {
                clearTimeout(pendingSearch.current);
            }
        };
    }, [searchText]);

    function handleSelect(userId: Key | null) {
        if (!userId) return;

        const user = results.find(user => user.id === String(userId));

        if (!user) return;

        if (!value.some(existing => existing.id === user.id)) {
            onChange([...value, user]);
        }

        setSearchText("");
    }

    return (
        <div>
            <AutoComplete
                name="User email"
                items={availableResults}
                value={null}
                inputValue={searchText}
                onChange={handleSelect}
                onInputChange={setSearchText}
                getKey={(user) => user.id}
                getValue={(user) => user.id}
                getDisplayValue={(user) => user.email}
                getSearchText={(user) => user.email}
            />

            {value.length > 0 &&
                <div className={styles.userList}>
                    {value.map(user => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onRemove={(id) =>
                                onChange(value.filter(user => user.id !== id))
                            }
                        />
                    ))}
                </div>
            }
        </div>
    );
}