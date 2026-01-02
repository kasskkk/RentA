import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ApartmentSkeleton from "../../../shared/components/ApartmentSkeleton";
import ApartmentMembersTable from "../../../shared/components/ApartmentMembersTable";

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
        <div className="flex flex-col md:flex-row gap-6 p-4 items-start">

            <div className="card bg-base-100 w-full md:w-96 shadow-sm border border-base-300">
                <figure className="bg-base-200 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="125" height="125" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-2xl">{apartment.name}</h2>
                    <p className="text-base-content/70">{apartment.description}</p>

                    <button className="btn btn-outline btn-sm" onClick={() => setMapOpen(!mapOpen)}>
                        {mapOpen ? 'Hide map' : 'Open map'}
                    </button>

                    {mapOpen && (
                        <div className="rounded-xl overflow-hidden border border-base-300 h-64">
                            <MapComponent
                                position={[apartment.latitude, apartment.longitude]}
                                location={apartment.name}
                            />
                        </div>
                    )}

                    <div className="card-actions justify-end mt-4">
                        <NavLink to="/apartments" className="btn btn-ghost">Back</NavLink>
                        {!isOwner && (
                            <button className="btn btn-primary grow" disabled={applyToApartment.isPending} onClick={() => applyToApartment.mutate(apartment.id)}>
                                Apply
                            </button>
                        )}
                        {isOwner && (
                            <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-warning">Edit</NavLink>
                        )}
                    </div>
                </div>
            </div>

            {isOwner && (
                <div className="card bg-base-100 flex-1 shadow-sm border border-base-300 p-6">
                    <h3 className="text-lg font-bold mb-4">Apartment Members</h3>
                    <div className="overflow-x-auto">
                        <ApartmentMembersTable apartment={apartment}/>
                    </div>
                </div>
            )}

        </div>
    );
}
