import type {
    ProjectUpdate
} from '@receipts/shared-schemas/generated';
import {
    ProjectForm,
    ProjectResultCustom
} from '@receipts/shared-schemas/project';
import { apiFetch } from './api';


export function getProject(projectId: string) {
    return apiFetch<ProjectResultCustom>(`/api/projects/${projectId}`)
}

export function getProjects(parentProjectId?: string | null) {
    const query = parentProjectId
        ? `?parentProjectId=${encodeURIComponent(parentProjectId)}`
        : ''

    return apiFetch<ProjectResultCustom[]>(`/api/projects${query}`)
}

export function createProject(data: ProjectForm) {
    return apiFetch<ProjectResultCustom>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    })
}

export function updateProject(id: string, updatedProject: ProjectUpdate) {
    return apiFetch<ProjectResultCustom>(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProject),
        headers: { 'Content-Type': 'application/json' },
    })
}

export function deleteProject(id: string) {
    return apiFetch<{ success: boolean }>(`/api/projects/${id}`, {
        method: 'DELETE',
    })
}