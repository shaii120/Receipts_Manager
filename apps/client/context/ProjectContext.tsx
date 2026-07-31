'use client'

import { createContext, useContext, useState } from 'react'
import type { ProjectResult } from '@receipts/shared-schemas/generated';
import { getProjects } from '@/lib/projects'

type ProjectContextType = {
    selectedProjectId: string | null
    projects: ProjectResult[]
    setSelectedProjectId: (id: string | null) => void
    loadProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [projects, setProjects] = useState<ProjectResult[]>([])

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

    return (
        <ProjectContext.Provider value={{
            selectedProjectId,
            projects,
            setSelectedProjectId,
            loadProjects: handleLoadProjects
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