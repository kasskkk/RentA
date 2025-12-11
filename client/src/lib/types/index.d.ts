type Apartment = {
    id: string
    date: string
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
}
export type LocationIQSuggestion = {
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

export type LocationIQAddress = {
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
