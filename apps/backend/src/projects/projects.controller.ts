import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ProjectUpdateSchema } from '@receipts/shared-schemas/generated';
import { ProjectFormSchema } from "@receipts/shared-schemas/project";
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    updateProject
} from './projects.service.js'
import {
    ProjectRequest,
    ProjectQueryRequest
} from '../types/requests.js';

export async function createProjectController(req: Request, res: Response) {
    const userId = req.user!.userId;
    const parsed = ProjectFormSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid project data', errors: parsed.error });
    }

    const project = await createProject(userId, parsed.data);

    res.json(project);
}

export async function updateProjectController(req: ProjectRequest, res: Response) {
    const { projectId } = req.params;
    try {
        const parsed = ProjectUpdateSchema.safeParse(req.body);
        if (!parsed.success)
            throw Error('Invalid project data')
        const project = await updateProject(projectId, parsed.data);
        res.json(project);
    }
    catch (err: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
    }
}

export async function getProjectController(req: ProjectRequest, res: Response) {
    const { projectId } = req.params;
    const project = await getProject(projectId);

    if (!project) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Project not found' });
    }

    res.json(project);
}

export async function getProjectsController(req: ProjectQueryRequest, res: Response) {
    const userId = req.user!.userId;
    const projects = await getProjects(userId, req.query.parentProjectId);

    res.json(projects);
}

export async function deleteProjectController(req: ProjectRequest, res: Response) {
    const { projectId } = req.params;
    await deleteProject(projectId);

    res.json({ success: true });
}