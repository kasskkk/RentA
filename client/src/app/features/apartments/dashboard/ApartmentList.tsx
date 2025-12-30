import { useEffect } from "react";
import { useApartments } from "../../../../lib/hooks/useApartments";
import ApartmentCard from "./ApartmentCard"
import { useInView } from "react-intersection-observer";


export default function ApartmentList() {
    const { apartments, isPending, hasNextPage, fetchNextPage } = useApartments();
    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage])

    if (!apartments || isPending) return <div>Laduje sie</div>

    return (
        <>
            <div className="grid grid-cols-3 gap-10">
                {apartments.map(apartment => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
            </div>

            {/* SENTINEL */}
            <div ref={ref} className="h-10" />
        </>
    );
}
