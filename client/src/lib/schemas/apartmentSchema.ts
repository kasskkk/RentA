import { z } from 'zod';

const requiredString = (fieldName: string) =>
    z.string().nonempty(`${fieldName} is required`)

const requiredNumber = (fieldName: string) =>
    z.number().nonoptional(`${fieldName} is required`)

export const apartmentSchema = z.object({
    name: requiredString("Name"),
    description: requiredString("Description"),
    city: requiredString("City"),
    street: requiredString("Street"),
    price: requiredNumber("Price"),
    buildingNumber: requiredString("Building number"),
    apartmentNumber: requiredString("Apartment number"),
})

export type ApartmentSchema = z.infer<typeof apartmentSchema>;