import { prisma } from '../lib/prisma.js';
import { dbExecute } from "../lib/db.js";
import { ProjectUpdate, ProjectCreate } from "@receipts/shared-schemas/generated";

export async function createProject(creatorId: string, projectData: ProjectCreate) {
    return dbExecute(() => prisma.project.create({
        data: {
            name: projectData.name.trim(),
            description: projectData.description ?? null,
            users: {
                create: {
                    userId: creatorId
                }
            }
        }
    }));
}

export async function updateProject(
    projectId: string,
    data: ProjectUpdate
) {
    const queries = [];

    if (data.name && data.name.trim() !== '') {
        queries.push(
            prisma.project.update({
                where: { id: projectId },
                data: { name: data.name.trim() }
            })
        );
    }

    if (data.usersId && data.usersId.length > 0) {
        const newIds = new Set(data.usersId);

        const existing = await prisma.userProject.findMany({
            where: { projectId },
            select: { userId: true }
        });
        const existingIds = new Set(existing.map(e => e.userId));

        const toAdd = [...newIds].filter(id => !existingIds.has(id));
        const toRemove = [...existingIds].filter(id => !newIds.has(id));

        if (toAdd.length > 0) {
            queries.push(
                prisma.userProject.createMany({
                    data: toAdd.map(userId => ({
                        userId,
                        projectId
                    }))
                })
            );
        }

        if (toRemove.length > 0) {
            queries.push(
                prisma.userProject.deleteMany({
                    where: {
                        projectId,
                        userId: { in: toRemove }
                    }
                })
            );
        }
    }

    if (queries.length === 0) {
        return;
    }

    // run all operations atomically
    return prisma.$transaction(queries);
}

export async function deleteProject(projectId: string) {
    return dbExecute(() => prisma.project.delete({
        where: { id: projectId }
    }));
}

export async function getProjects(userId: string) {
    return dbExecute(() => prisma.project.findMany({
        where: {
            users: {
                some: { userId }
            }
        }
    }));
}