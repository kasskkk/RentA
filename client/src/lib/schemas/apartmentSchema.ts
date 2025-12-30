import { z } from 'zod';

const requiredString = (fieldName: string) =>
    z.string().nonempty(`${fieldName} is required`)

const requiredNumber = (fieldName: string) =>
    z.number(`${fieldName} is required`)

const requiredBoolean = (fieldName: string) =>
    z.boolean(`${fieldName} is required`)

export const apartmentSchema = z.object({
    name: requiredString("Name"),
    description: requiredString("Description"),
    pricePerMonth: requiredNumber("Price"),
    isAvailable: requiredBoolean("IsAvailable"),
    rooms: requiredNumber("Rooms"),
    area: requiredNumber("Area"),
    maxOccupants: requiredNumber("MaxOccupants"),
    devices: z.array(z.object({
        name: requiredString("Nazwa urządzenia"), 
        brand: requiredString("Marka"),           
        description: z.string().optional(),       
    })).optional(),
    location: z.object({
        city: requiredString("City"),
        street: requiredString("Street"),
        buildingNumber: requiredString("Building number"),
        apartmentNumber: z.string().optional(),
        latitude: z.number().refine(v => !isNaN(v), "Latitude must be a number"),
        longitude: z.number().refine(v => !isNaN(v), "Longitude must be a number"),
    })
})

export type ApartmentSchema = z.infer<typeof apartmentSchema>;