import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ProfileAvatarCard from "../../profiles/ProfileAvatarCard";
import ApartmentSkeleton from "../../../shared/components/ApartmentSkeleton";

export default function ApartmentDetails() {
    const { id } = useParams();
    const { apartment, isPendingApartment, applyToApartment } = useApartments(id);
    const [mapOpen, setMapOpen] = useState(false);
    const { currentUser } = useAccount();
    const isOwner = currentUser?.userRole === "Owner";

    if (!apartment) return (
        <ApartmentSkeleton />
    )

    if (isPendingApartment) return <div>ladddduje</div>

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <svg xmlns="http://www.w3.org/2000/svg" width="125" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{apartment.name}</h2>
                <p>{apartment.description}</p>
                <button className="btn" onClick={() => setMapOpen(!mapOpen)}>{mapOpen ? 'Hide map' : 'Open map'}</button>
                {mapOpen && (
                    <div>
                        <MapComponent
                            position={[apartment.latitude, apartment.longitude]}
                            location={apartment.name}
                        />
                    </div>
                )}
                {isOwner && (
                    <ul>
                        <div className="grid grid-cols-3 gap-10">
                            {apartment.apartmentMembers.map(memb => (
                                <ProfileAvatarCard key={memb.user.id} profile={memb.user} />
                            ))}
                        </div>
                    </ul>
                )}
                <div className="card-actions justify-end">
                    <NavLink to="/apartments" className="btn btn-primary">Back</NavLink>
                    {!isOwner && (
                        <button className="btn btn-neutral w-full mt-2" disabled={applyToApartment.isPending} onClick={() => applyToApartment.mutate(apartment.id)}>Apply</button>
                    )}
                    {isOwner && (
                        <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-inherit">Edit</NavLink>
                    )}
                </div>
            </div>
        </div>
    )
}
