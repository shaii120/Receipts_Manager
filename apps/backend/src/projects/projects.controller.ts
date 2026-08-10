import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ProjectUpdateSchema } from '@receipts/shared-schemas/generated';
import { ProjectFormSchema } from "@receipts/shared-schemas/project";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject
} from './projects.service.js'
import { ProjectRequest } from '../types/requests.js';

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
    const parsed = ProjectUpdateSchema.parse(req.body);
    const project = await updateProject(projectId, parsed);

    res.json(project);
}

export async function getProjectsController(req: Request, res: Response) {
    const userId = req.user!.userId;
    const projects = await getProjects(userId);

    res.json(projects);
}

export async function deleteProjectController(req: ProjectRequest, res: Response) {
    const { projectId } = req.params;
    await deleteProject(projectId);

    res.json({ success: true });
}