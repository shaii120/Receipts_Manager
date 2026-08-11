'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/context/ProjectContext'
import CreateProjectDialog from '@/components/ProjectForm/CreateProjectDialog'
import ProjectMenu from "@/components/ProjectMenu/ProjectMenu"
import styles from './ProjectSidebar.module.css'

export function ProjectSidebar() {
    const {
        selectedProjectId,
        projects,
        setSelectedProjectId,
        loadProjects
    } = useProject()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    useEffect(() => {
        loadProjects()
    }, [])

    const plusSign = `
        M 12 5
        v 14
        M 5 12
        h 14`

    return (
        <div className={styles.sidebarContainer}>
            <button
                type='button'
                className={`${styles.button} ${styles.toggleButton}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? '>' : '<'}
            </button>

            <aside
                className={isCollapsed ? styles.collapsed : styles.sidebarList} >
                <button
                    onClick={() => setShowCreateDialog(true)}
                    className={`${styles.button} ${styles.createButton}`}
                >
                    <svg className={styles.createButtonIcon} viewBox="0 0 24 24">
                        <path d={plusSign} />
                    </svg>

                    Add New Project
                </button>

                {projects.map(p => (
                    <div
                        key={p.id}
                        onClick={() => setSelectedProjectId(p.id)}
                        className={`${styles.item} ${selectedProjectId === p.id ? styles.active : ''}`}
                    >
                        <ProjectMenu project={p} />
                        {p.name}
                    </div>
                ))}
            </aside>

            <CreateProjectDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onCreated={(project) => {
                    setSelectedProjectId(project.id)
                    loadProjects()
                }}
            />
        </div>
    )
}