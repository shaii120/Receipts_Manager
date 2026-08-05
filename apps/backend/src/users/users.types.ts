import { Prisma } from "@prisma/client";

export const userPublicSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true
});