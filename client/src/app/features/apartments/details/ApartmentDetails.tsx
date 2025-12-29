import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ProfileAvatarCard from "../../profiles/ProfileAvatarCard";

export default function ApartmentDetails() {
    const { id } = useParams();
    const { apartment, isPendingApartment, applyToApartment } = useApartments(id);
    const [mapOpen, setMapOpen] = useState(false);
    const { currentUser } = useAccount();
    const isOwner = currentUser?.userRole === "Owner";

    if (!apartment) return <div>nie ma</div>
    if (isPendingApartment) return <div>ladddduje</div>

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
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
