"use client";

import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProjectProvider } from "@/context/ProjectContext";
import UserHeader from "@/components/UserMenu/UserHeader";
import styles from "./Layout.module.css";
import { ProjectSidebar } from "@/components/ProjectSidebar/ProjectSidebar";

function AppShell({ children }: { children: React.ReactNode }) {
    const { loadUser } = useAuth();

    useEffect(() => { loadUser(); }, []);

    return (
        <>
            <header className={styles.header}>
                <UserHeader />
            </header>

            <div className={styles.container}>
                <ProjectSidebar />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ProjectProvider>
                <AppShell>{children}</AppShell>
            </ProjectProvider>
        </AuthProvider>
    );
}
