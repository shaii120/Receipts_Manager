'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'
import type { ProjectResultCustom } from '@receipts/shared-schemas/project'
import { getProject, getProjects } from '@/lib/projects'

type ProjectContextType = {
    selectedProject: ProjectResultCustom | null
    projects: ProjectResultCustom[]
    canGoBack: boolean
    selectProject: (project: ProjectResultCustom | null) => Promise<void>
    projectCreated: (project: ProjectResultCustom) => Promise<void>
    refreshProjects: () => Promise<ProjectResultCustom[] | null>
    goBack: () => Promise<void>
    updateProjectTotalAmount: (totalAmount: number) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProject, setSelectedProject] = useState<ProjectResultCustom | null>(null)
    const [projects, setProjects] = useState<ProjectResultCustom[]>([])
    const [displayedProjectsParent, setDisplayedProjectsParent] = useState<ProjectResultCustom | null>(null)

    async function refreshProjects(): Promise<ProjectResultCustom[] | null> {
        try {
            const parentProjectId = displayedProjectsParent?.id ?? null
            const data = await getProjects(parentProjectId)
            setProjects(data)
            return data
        } catch (err) {
            console.error(err)
            return null
        }
    }

    useEffect(() => {
        refreshProjects()
    }, [])

    async function selectProject(project: ProjectResultCustom | null) {
        setSelectedProject(project ?? displayedProjectsParent)
        if (!project)
            return
        const data = await getProjects(project.id)

        if (data && data.length > 0) {
            setProjects(data)
            setDisplayedProjectsParent(project)
        }
    }

    async function projectCreated(project: ProjectResultCustom) {
        if (project.parentProjectId === (displayedProjectsParent?.id ?? null)) {
            await refreshProjects()
            setSelectedProject(project)
            return
        }

        if (selectedProject && selectedProject.id === project.parentProjectId) {
            await selectProject(selectedProject)
        }
    }

    async function goBack() {
        if (!displayedProjectsParent) return

        const parentProject = displayedProjectsParent.parentProjectId ? await getProject(displayedProjectsParent.parentProjectId) : null
        setSelectedProject(parentProject)
        const data = await getProjects(parentProject?.id)
        setProjects(data)
        setDisplayedProjectsParent(parentProject)
    }

    function updateProjectTotalAmount(totalAmount: number) {
        if (selectedProject)
            setSelectedProject({ ...selectedProject, totalAmount })
    }

    return (
        <ProjectContext.Provider value={{
            selectedProject,
            projects,
            canGoBack: displayedProjectsParent !== null,
            selectProject,
            projectCreated,
            refreshProjects,
            goBack,
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