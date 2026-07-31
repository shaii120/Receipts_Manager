import { z } from "zod";

export const currencySchema = z.object({
    code: z.string().length(3, { message: "Currency code must be 3 characters long" }),
    name: z.string().min(1, { message: "Currency name cannot be empty" }),
});
export type Currency = z.infer<typeof currencySchema>;