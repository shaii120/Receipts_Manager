"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import styles from "./UserMenu.module.css";

export default function LogoutButton() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userIcon = "👤"
  const buttonsMap = new Map<string, () => void>([
    ["Logout", handleLogout]
  ]);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        className={styles.menuButton}
        onClick={() => setIsOpen((value) => !value)}
      >
        {userIcon}
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {user && (
            <div className={styles.user}>
              {user.email}
            </div>
          )}

          {Array.from(buttonsMap, ([label, action]) => (
            <button
              key={label}
              className={styles.menuItem}
              onClick={action}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}