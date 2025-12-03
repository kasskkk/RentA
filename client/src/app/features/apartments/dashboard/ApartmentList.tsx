import { useApartments } from "../../../../lib/hooks/useApartments";
import ApartmentCard from "./ApartmentCard"



export default function ApartmentList() {
    const { apartments, isPending } = useApartments();
    if (!apartments || isPending) return <div>Laduje sie</div>

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
