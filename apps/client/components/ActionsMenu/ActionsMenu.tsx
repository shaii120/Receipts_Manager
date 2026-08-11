"use client";

import {
    MenuTrigger,
    Button,
    Popover,
    Menu,
    MenuItem
} from "react-aria-components";

import styles from "./ActionsMenu.module.css";

export type ActionMenuItem = {
    key: string;
    label: string;
    onAction: () => void;
};

type ActionsMenuProps = {
    label: string;
    actions: ActionMenuItem[];
};

export default function ActionsMenu({
    label,
    actions
}: ActionsMenuProps) {
    return (
        <MenuTrigger>
            <Button
                className={styles.button}
                onClick={(event) => event.stopPropagation()}
                aria-label={label}
            >
                ⋮
            </Button>

            <Popover className={styles.popover}>
                <Menu className={styles.menu}>
                    {actions.map(action => (
                        <MenuItem
                            key={action.key}
                            id={action.key}
                            className={styles.menuItem}
                            onAction={action.onAction}
                        >
                            {action.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
}