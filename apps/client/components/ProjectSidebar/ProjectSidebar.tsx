'use client'

import { useEffect, useState } from 'react'
import { ProjectResult } from '@receipts/shared-schemas/generated'
import styles from './ProjectSidebar.module.css'
import { createProject, getProjects } from '@/lib/projects'
import { useProject } from '@/context/ProjectContext'

export function ProjectSidebar() {
    const { selectedProjectId, projects, setSelectedProjectId, loadProjects } = useProject()
    const [creating, setCreating] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    function handleCreateProject() {
        const name = prompt('Project name')

        if (!name) return

        setCreating(true)

        createProject(name)
            .then((newProject) => setSelectedProjectId(newProject.id))
            .then(loadProjects)
            .catch(err => {
                console.error(err)
                alert('Failed to create project')
            })
            .finally(() => setCreating(false))
    }

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
                    onClick={handleCreateProject}
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
                        {p.name}
                    </div>
                ))}
            </aside>
        </div>
    )
}