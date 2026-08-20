'use client'

import { useState } from 'react'
import { GridList, GridListItem } from 'react-aria-components'
import { useProject } from '@/context/ProjectContext'
import CreateProjectDialog from '@/components/ProjectForm/CreateProjectDialog'
import ProjectMenu from "@/components/ProjectMenu/ProjectMenu"
import styles from './ProjectSidebar.module.css'

export function ProjectSidebar() {
    const {
        selectedProject,
        projects,
        canGoBack,
        selectProject,
        projectCreated,
        goBack
    } = useProject()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showCreateDialog, setShowCreateDialog] = useState(false)

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

                {
                    canGoBack
                    && (
                        <button
                            type="button"
                            onClick={goBack}
                            className={styles.button}
                        >
                            Back
                        </button>
                    )}

                <GridList
                    aria-label="Projects"
                    selectionMode="single"
                    selectedKeys={selectedProject?.id ? [selectedProject.id] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = [...keys][0]
                        const project = projects.find(
                            project => project.id === String(selectedKey)
                        )

                        selectProject(project ?? null)
                    }}
                >
                    {projects.map(project => (
                        <GridListItem
                            key={project.id}
                            id={project.id}
                            textValue={project.name}
                            className={styles.item}
                        >
                            <ProjectMenu project={project} />
                            {project.name}
                        </GridListItem>
                    ))}
                </GridList>
            </aside>

            <CreateProjectDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onCreated={async (project) => {
                    await projectCreated(project)
                    setShowCreateDialog(false)
                }}
            />
        </div>
    )
}