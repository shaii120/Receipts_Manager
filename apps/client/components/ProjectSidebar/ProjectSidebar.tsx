'use client'

import { useEffect, useState } from 'react'
import { GridList, GridListItem } from 'react-aria-components'
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

                <GridList
                    aria-label="Projects"
                    selectionMode="single"
                    selectedKeys={selectedProjectId ? [selectedProjectId] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = [...keys][0]
                        setSelectedProjectId(selectedKey ? String(selectedKey) : null)
                    }}
                >
                    {projects.map(p => (
                        <GridListItem
                            key={p.id}
                            id={p.id}
                            className={styles.item}
                        >
                            <ProjectMenu project={p} />
                            {p.name}
                        </GridListItem>
                    ))}
                </GridList>
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