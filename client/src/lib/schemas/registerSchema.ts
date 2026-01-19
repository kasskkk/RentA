import z from "zod";
import { requiredString } from "../util/util";

export const registerSchema = z.object({
    displayName: requiredString('displayName'),
    email: z.email(),
    password: requiredString('password'),
    firstName: requiredString('firstName'),
    lastName: requiredString('lastName'),
    phoneNumber: requiredString('phoneNumber'),
    isOwner: z.boolean()
})

export type RegisterSchema = z.infer<typeof registerSchema>