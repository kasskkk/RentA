import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ProfileAvatarCard from "../../profiles/ProfileAvatarCard";
import FaultList from "./FaultList";
import type { Device, ApartmentMember } from "../../../../lib/types";
// 👇 1. IMPORTUJEMY MODAL
import FaultCreateDialog from "./FaultCreateDialog";

const APPLIANCES = [
    "Telewizor", "Lodówka", "Pralka", "Zmywarka",
    "Klimatyzacja", "Mikrofalówka", "Żelazko", "Suszarka do włosów"
];

const AMENITIES = [
    "Internet (WiFi)", "Balkon / Taras", "Garaż / Parking", "Winda",
    "Ogród", "Basen", "Siłownia", "Recepcja / Ochrona"
];

export default function ApartmentDetails() {
    const { id } = useParams();
    const { apartment, isPendingApartment, applyToApartment, loadApartment } = useApartments(id);
    const [mapOpen, setMapOpen] = useState(false);
    const { currentUser } = useAccount();
    
    const [activeTab, setActiveTab] = useState<'details' | 'faults'>('details');
    
    // 👇 2. NOWY STAN: Czy modal zgłaszania jest otwarty?
    const [isFaultModalOpen, setFaultModalOpen] = useState(false);

    const isOwner = currentUser?.userRole?.toLowerCase() === "owner";

    if (!apartment) return <div>nie ma</div>
    if (isPendingApartment) return <div>ladddduje</div>

    const activeFaultsCount = apartment.devices?.reduce((acc: number, device: Device) => 
        acc + (device.faults?.filter(f => !f.isResolved).length || 0), 0) || 0;

    const appliances = apartment.devices.filter((d: Device) => APPLIANCES.includes(d.name));
    const amenities = apartment.devices.filter((d: Device) => AMENITIES.includes(d.name));
    const others = apartment.devices.filter((d: Device) => !APPLIANCES.includes(d.name) && !AMENITIES.includes(d.name));

    const renderDeviceSection = (title: string, items: Device[], icon: React.ReactNode) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6">
                <h3 className="font-bold text-md text-base-content mb-3 flex items-center gap-2 border-b border-base-200 pb-2">
                    {icon} {title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((device, index) => (
                        <div
                            key={device.id || index}
                            className="p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-200 border border-base-200"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm text-base-content">{device.name}</span>
                            </div>
                            {device.description ? (
                                <p className="text-xs text-base-content/70 mt-1">{device.description}</p>
                            ) : (
                                <p className="text-xs text-base-content/30 italic mt-1">Brak dodatkowego opisu</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="card bg-base-100 w-full max-w-4xl shadow-xl my-6">
            <figure className="max-h-96 overflow-hidden">
                <img
                    className="w-full object-cover"
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Apartment" />
            </figure>
            <div className="card-body">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h2 className="card-title text-3xl">{apartment.name}</h2>
                        <div className="badge badge-secondary badge-outline mt-2">{apartment.city}, {apartment.street}</div>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-2xl font-bold text-primary">{apartment.pricePerMonth} PLN</div>
                        <div className="text-xs text-base-content/60">miesięcznie</div>
                    </div>
                </div>

                <div role="tablist" className="tabs tabs-bordered mt-6">
                    <a role="tab" className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`} onClick={() => setActiveTab('details')}>Szczegóły</a>
                    <a role="tab" className={`tab ${activeTab === 'faults' ? 'tab-active' : ''}`} onClick={() => setActiveTab('faults')}>
                        Usterki
                        {activeFaultsCount > 0 && <span className="badge badge-error badge-xs ml-2 text-white">{activeFaultsCount}</span>}
                    </a>
                </div>

                {activeTab === 'details' && (
                    <div className="animate-fade-in">
                        <p className="mt-4 text-base-content/80 leading-relaxed text-lg">{apartment.description}</p>
                        <div className="mt-8 pt-4 border-t border-base-300">
                            {renderDeviceSection("Sprzęt i Urządzenia", appliances, <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>)}
                            {renderDeviceSection("Udogodnienia", amenities, <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>)}
                            {renderDeviceSection("Pozostałe", others, <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>)}
                            
                            {apartment.devices.length === 0 && <div className="alert bg-base-200 text-sm py-3"><span>Brak informacji o wyposażeniu.</span></div>}
                        </div>
                        <div className="mt-6 flex flex-col gap-4">
                            <button className="btn btn-outline btn-sm w-full md:w-auto self-start" onClick={() => setMapOpen(!mapOpen)}>{mapOpen ? 'Ukryj mapę' : 'Pokaż na mapie'}</button>
                            {mapOpen && <div className="rounded-lg overflow-hidden border border-base-300 h-96 w-full"><MapComponent position={[apartment.latitude, apartment.longitude]} location={apartment.name} /></div>}
                        </div>
                        {isOwner && (
                            <div className="mt-8 pt-6 border-t border-base-300">
                                <h3 className="font-bold text-sm uppercase tracking-wide opacity-70 mb-4">Mieszkańcy</h3>
                                <div className="flex flex-wrap gap-4">
                                    {apartment.apartmentMembers.map((memb: ApartmentMember) => (
                                        <ProfileAvatarCard key={memb.user.id} profile={memb.user} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'faults' && (
                    <div className="animate-fade-in">
                        <FaultList 
                            devices={apartment.devices} 
                            isOwner={isOwner} 
                            refresh={loadApartment}
                            // 👇 3. PODPINAMY OTWIERANIE MODALA
                            onAddClick={() => setFaultModalOpen(true)} 
                        />

                        {/* 👇 4. RENDERUJEMY MODAL */}
                        <FaultCreateDialog 
                            isOpen={isFaultModalOpen}
                            onClose={() => setFaultModalOpen(false)}
                            onSuccess={loadApartment}
                            devices={apartment.devices}
                        />
                    </div>
                )}

                <div className="card-actions justify-end mt-8 border-t border-base-200 pt-4">
                    <NavLink to="/apartments" className="btn btn-ghost">Wróć</NavLink>
                    {!isOwner && (
                        <button className="btn btn-primary px-8" disabled={applyToApartment.isPending} onClick={() => applyToApartment.mutate(apartment.id)}>Aplikuj</button>
                    )}
                    {isOwner && <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-primary">Edytuj</NavLink>}
                </div>
            </div>
        </div>
    )
}