'use client'

import { createContext, useContext, useState } from 'react'
import type { ProjectResultCustom } from '@receipts/shared-schemas/project'
import { getProjects } from '@/lib/projects'

type ProjectContextType = {
    selectedProjectId: string | null
    projects: ProjectResultCustom[]
    setSelectedProjectId: (id: string | null) => void
    loadProjects: () => Promise<void>
    updateProjectTotalAmount: (projectId: string, totalAmount: number) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [projects, setProjects] = useState<ProjectResultCustom[]>([])

    async function handleLoadProjects() {
        try {
            const data = await getProjects()
            if (data) {
                setProjects(data)
            }
        } catch (err) {
            console.error(err)
            setProjects([])
        }
    }

    function updateProjectTotalAmount(projectId: string, totalAmount: number) {
        setProjects(currentProjects =>
            currentProjects.map(project =>
                project.id === projectId
                    ? { ...project, totalAmount }
                    : project
            )
        )
    }

    return (
        <ProjectContext.Provider value={{
            selectedProjectId,
            projects,
            setSelectedProjectId,
            loadProjects: handleLoadProjects,
            updateProjectTotalAmount
        }}>
            {children}
        </ProjectContext.Provider>
    )
}

export function useProject() {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error('useProject must be used within ProjectProvider')
    return ctx
}