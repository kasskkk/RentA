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
                <div className="mt-6 pt-4 border-t border-base-300">
                    <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2">
                        {/* Ikona w kolorze głównym motywu (primary) */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 17.25v-1.007c0-.197.105-.377.276-.474l.294-.168a2.5 2.5 0 0 0 1.33-2.193v-.832c0-.52-.132-1.026-.38-1.48l-1.338-2.341a.75.75 0 0 0-.65-.375H10.47a.75.75 0 0 0-.65.375l-1.338 2.341c-.248.454-.38.96-.38 1.48v.832c0 .927.502 1.776 1.33 2.193l.294.168c.17.097.276.277.276.474Z" />
                        </svg>
                        Udogodnienia
                    </h3>

                    {apartment.devices && apartment.devices.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {apartment.devices.map((device, index) => (
                                <div 
                                    key={device.id || index} 
                                    className="p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-200 flex flex-col gap-1 border border-transparent hover:border-base-content/10"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-base-content">{device.name}</span>
                                        {/* Badge w stylu DaisyUI */}
                                        <div className="badge badge-sm badge-outline badge-primary whitespace-nowrap">
                                            {device.brand}
                                        </div>
                                    </div>
                                    
                                    {device.description ? (
                                        <p className="text-xs text-base-content/70">{device.description}</p>
                                    ) : (
                                        <p className="text-xs text-base-content/40 italic">Brak opisu</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert bg-base-200 text-sm py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Brak informacji o wyposażeniu.</span>
                        </div>
                    )}
                </div>
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
