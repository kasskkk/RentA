import ApartmentCard from "./ApartmentCard"

type Props = {
    apartments: Apartment[]
}

export default function ApartmentList({ apartments }: Props) {
    return (
        <ul>
            <div className="grid grid-cols-3 gap-10">
                {apartments.map(apartment => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
            </div>
        </ul>
    )
}
