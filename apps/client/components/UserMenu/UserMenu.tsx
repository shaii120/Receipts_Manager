"use client";

import { useRouter } from "next/navigation";
import {
    MenuTrigger,
    Button,
    Popover,
    Menu,
    MenuItem,
} from "react-aria-components";

import type { ActionMenuItem } from "@/components/ActionsMenu/ActionsMenu"
import { useAuth } from "@/context/AuthContext";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const userIcon = "👤"
    const itemsMap: ActionMenuItem[] = [
        { key: "logout", label: "Logout", onAction: handleLogout }
    ]

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (
        <MenuTrigger>
            <Button
                className={styles.button}
                aria-label="User menu"
            >
                {userIcon}
            </Button>

            <Popover className={styles.popover}>
                <div className={styles.user}>
                    {user?.email}
                </div>

                <Menu className={styles.menu}>
                    <MenuItem
                        id="logout"
                        className={styles.menuItem}
                        onAction={handleLogout}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Popover>
        </MenuTrigger>
    );
}