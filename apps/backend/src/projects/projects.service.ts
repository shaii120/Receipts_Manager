import { prisma } from 'prisma-my-db/connector';
import { ProjectUpdate } from "@receipts/shared-schemas/generated";
import { ProjectCreateForm } from "@receipts/shared-schemas/project";
import { dbExecute } from "../lib/db.js";

export async function createProject(creatorId: string, projectData: ProjectCreateForm) {
    return dbExecute(() => prisma.project.create({
        data: {
            name: projectData.name.trim(),
            description: projectData.description ?? null,
            primaryCurrency: projectData.primaryCurrency,
            users: {
                create: [{
                    userId: creatorId,
                    role: 'OWNER'
                },
                ...projectData.usersId]
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
        const newIds = new Map(data.usersId.map(user => [user.userId, user.role]));

        const existing = await prisma.userProject.findMany({
            where: { projectId },
            select: { userId: true, role: true }
        });
        const existingIds = new Map(existing.map(e => [e.userId, e.role]));

        const toAdd = [...newIds.entries()].filter(([userId]) => !existingIds.has(userId));
        const toRemove = [...existingIds.keys()].filter(userId => !newIds.has(userId));
        const toUpdate = [...newIds.entries()].filter(([userId, role]) => existingIds.has(userId) && role !== existingIds.get(userId));

        if (toAdd.length > 0) {
            queries.push(
                prisma.userProject.createMany({
                    data: toAdd.map(([userId, role]) => ({
                        userId,
                        projectId,
                        role: role
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

        if (toUpdate.length > 0) {
            for (const [userId, role] of toUpdate) {
                queries.push(
                    prisma.userProject.update({
                        where: {
                            userId_projectId: { projectId, userId }
                        },
                        data: { role }
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