import type {
    ProjectResult,
    ProjectUpdate
} from '@receipts/shared-schemas/generated';
import { ProjectCreateForm } from '@receipts/shared-schemas/project';
import { apiFetch } from './api';

export function getProjects() {
    return apiFetch<ProjectResult[]>('/api/projects')
}

export function createProject(data: ProjectCreateForm) {
    return apiFetch<ProjectResult>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    })
}

export function updateProject(id: string, updatedProject: ProjectUpdate) {
    return apiFetch<ProjectResult>(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProject),
        headers: { 'Content-Type': 'application/json' },
    })
}

export function deleteProject(id: string) {
    return apiFetch<ProjectResult>(`/api/projects/${id}`, {
        method: 'DELETE',
    })
}