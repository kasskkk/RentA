import { useEffect } from "react";
import { useApartments } from "../../../../lib/hooks/useApartments";
import ApartmentCard from "./ApartmentCard"
import { useInView } from "react-intersection-observer";
import ApartmentSkeleton from "../../../shared/components/ApartmentSkeleton";


export default function ApartmentList() {
    const { apartments, hasNextPage, fetchNextPage } = useApartments();
    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage])

    if (!apartments) return
    (
        <div className="grid grid-cols-3 gap-10">
            <ApartmentSkeleton />
            <ApartmentSkeleton />
            <ApartmentSkeleton />
        </div>
    )

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
