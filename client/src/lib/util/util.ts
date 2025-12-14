import z from "zod";

export const requiredString = (fieldName: string) =>
    z.string()
        .nonempty(`${fieldName} is required`)