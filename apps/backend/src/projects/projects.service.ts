import { prisma } from 'prisma-my-db/connector';
import { ProjectUpdate } from "@receipts/shared-schemas/generated";
import { ProjectForm, type ProjectResultCustom } from "@receipts/shared-schemas/project";
import { userProjectSelect } from "../users/users.types.js"
import { dbExecute } from "../lib/db.js";

export async function createProject(creatorId: string, projectData: ProjectForm): Promise<ProjectResultCustom> {
    const project = await dbExecute(() => prisma.project.create({
        data: {
            name: projectData.name.trim(),
            description: projectData.description ?? null,
            primaryCurrency: projectData.primaryCurrency,
            parentProjectId: projectData.parentProjectId ?? null,
            users: {
                create: [{
                    userId: creatorId,
                    role: 'OWNER'
                },
                ...projectData.users]
            }
        },
        include: {
            users: {
                select: userProjectSelect
            }
        }
    }));


    return { ...project, totalAmount: Number(project.totalAmount) };
}

export async function updateProject(
    projectId: string,
    data: ProjectUpdate
) {
    const queries = [];

    if (data.name && data.name.trim()) {
        queries.push(
            prisma.project.update({
                where: { id: projectId },
                data: { name: data.name.trim() }
            })
        );
    }

    if (data.description && data.description.trim()) {
        queries.push(
            prisma.project.update({
                where: { id: projectId },
                data: { description: data.description.trim() }
            })
        );
    }

    if (data.primaryCurrency && data.primaryCurrency.trim()) {
        const orignialCurrency = (await getProject(projectId))?.primaryCurrency
        const hasReceipts = prisma.receipt.findFirst({
            where: { projectId },
            select: { id: true }
        });

        if (orignialCurrency !== data.primaryCurrency && await hasReceipts) {
            throw new Error("Cannot change primary currency of a project with receipts");
        }

        queries.push(
            prisma.project.update({
                where: { id: projectId },
                data: { primaryCurrency: data.primaryCurrency.trim() }
            })
        );
    }

    if (data.users && data.users.length > 0) {
        const newIds = new Map(data.users.map(user => [user.userId, user.role]));

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
    }

    if (queries.length === 0) {
        return;
    }

    // run all operations atomically
    const transaction = prisma.$transaction(queries);
    await dbExecute(() => transaction);

    const project = await getProject(projectId)
    if (!project) {
        throw new Error(`Project with ID ${projectId} not found after update.`);
    }
    const projectSendReady: ProjectResultCustom = { ...project, totalAmount: Number(project.totalAmount) }

    return projectSendReady;
}

export async function deleteProject(projectId: string) {
    return dbExecute(() =>
        prisma.$transaction(async transaction => {
            const projectLevels: string[][] = [[projectId]];
            let currentLevel = [projectId];

            while (currentLevel.length > 0) {
                const childProjects = await transaction.project.findMany({
                    where: {
                        parentProjectId: { in: currentLevel }
                    },
                    select: {
                        id: true
                    }
                });

                currentLevel = childProjects.map(project => project.id);
                projectLevels.push(currentLevel);
            }

            const projectIds = projectLevels.flat();

            await transaction.receipt.deleteMany({
                where: {
                    projectId: { in: projectIds }
                }
            });

            await transaction.userProject.deleteMany({
                where: {
                    projectId: { in: projectIds }
                }
            });

            for (const level of projectLevels.reverse()) {
                if (level.length > 0) {
                    await transaction.project.deleteMany({
                        where: {
                            id: { in: level }
                        }
                    });
                }
            }
        }));
}

export async function getProject(projectId: string): Promise<ProjectResultCustom | null> {
    const project = await dbExecute(() => prisma.project.findUnique({
        where: { id: projectId },
        include: {
            users: {
                select: userProjectSelect
            }
        }
    }));

    if (!project) {
        return null;
    }

    const projectSendReady: ProjectResultCustom = {
        ...project,
        totalAmount: Number(project.totalAmount)
    };

    return projectSendReady;
}

export async function getProjects(userId: string, parentProjectId: string | null = null): Promise<ProjectResultCustom[]> {
    const projects = await dbExecute(() => prisma.project.findMany({
        where: {
            parentProjectId,
            users: {
                some: { userId }
            }
        },
        include: {
            users: {
                select: userProjectSelect
            }
        },
        orderBy: {
            name: 'asc'
        }
    }));

    const projectsSendReady: ProjectResultCustom[] = projects.map(p => ({ ...p, totalAmount: Number(p.totalAmount) }))

    return projectsSendReady
}