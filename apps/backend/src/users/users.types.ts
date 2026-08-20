import { Prisma } from "@prisma/client";

export const userPublicSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true
});

export const userProjectSelect = Prisma.validator<Prisma.UserProjectSelect>()({
    role: true,
    user: {
        select: userPublicSelect
    }
})