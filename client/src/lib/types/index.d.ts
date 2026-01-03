type PagedList<T, TCursor> = {
    items: T[],
    nextCursor: TCursor
}

export interface Fault {
    id: string;
    title: string;
    description?: string;
    dateReported: string; 
    isResolved: boolean;
    dateResolved?: string;
    deviceId: string;
    deviceName: string;
}
export interface CreateFaultFormValues {
    title: string;
    description: string;
    deviceId: string;
}

export type Device = {
    id?: string;
    name: string;
    description?: string;
    faults: Fault[];
}

type Apartment = {
    id: string
    createdAt: string
    name: string
    description: string
    pricePerMonth: number
    isAvailable: boolean
    rooms: number
    area: number
    maxOccupants: number
    city: string
    street: string
    buildingNumber: string
    apartmentNumber?: string
    latitude: number
    longitude: number

    apartmentMembers: ApartmentMember[]
    devices: Device[]
}

export type MemberStatus = 'Pending' | 'Accepted' | 'Rejected'

export type ApartmentMember = {
    userId: string
    apartmentId: string
    user: User
    isOwner: boolean
    memberStatus: MemberStatus
    createdAt: string
    acceptedAt?: string
}

type LocationIQSuggestion = {
    place_id: string
    osm_id: string
    osm_type: string
    licence: string
    lat: string
    lon: string
    boundingbox: string[]
    class: string
    type: string
    display_name: string
    display_place: string
    display_address: string
    address: LocationIQAddress
}

type LocationIQAddress = {
    name: string
    house_number: string
    road: string
    neighbourhood?: string
    city: string
    county: string
    state: string
    postcode: string
    country: string
    country_code: string
}

type Profile = {
    id: string
    email: string
    phoneNumber: string
    displayName: string
    imageUrl?: string
    firstName?: string
    lastName?: string
}

type User = {
    id: string
    email: string
    phoneNumber: string
    displayName: string
    firstName?: string
    lastName?: string
    imageUrl?: string
    userRole: string
}

type Photo = {
    id: string
    url: string
    publicId: string
    userId: string
}
export interface Bill {
    id: string;
    title: string;
    description?: string;
    amount: number;
    dueDate: string;
    apartmentId: string;
}

export interface CreateBillFormValues {
    apartmentId: string;
    title: string;   
    description: string;
    amount: number;
    dueDate: string;
}