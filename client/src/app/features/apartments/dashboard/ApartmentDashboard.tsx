import { useApartments } from "../../../../lib/hooks/useApartments";
import ApartmentList from "./ApartmentList";


export default function ApartmentDashboard() {
    const { apartments, isPending } = useApartments();

    if (!apartments || isPending) return <div>Laduje sie</div>
    return (
        <>
            <ApartmentList />
        </>
    )
}
