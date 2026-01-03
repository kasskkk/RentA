import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ApartmentSkeleton from "../../../shared/components/ApartmentSkeleton";
import ApartmentMembersTable from "../../../shared/components/ApartmentMembersTable";
import ProfileAvatarCard from "../../profiles/ProfileAvatarCard";
import FaultList from "./FaultList";
import type { Device, ApartmentMember } from "../../../../lib/types";
import FaultCreateDialog from "./FaultCreateDialog";
import ApartmentBills from "../bills/ApartmentBills";

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
    const { apartment, isPendingApartment, applyToApartment } = useApartments(id);
    const [mapOpen, setMapOpen] = useState(false);
    const { currentUser } = useAccount();

    const [activeTab, setActiveTab] = useState<'details' | 'faults' | 'bills'>('details');

    const [isFaultModalOpen, setFaultModalOpen] = useState(false);

    const isOwner = currentUser?.userRole?.toLowerCase() === "owner";
    const isMember = apartment?.apartmentMembers?.some((m: ApartmentMember) => m.userId === currentUser?.id);

    if (isPendingApartment) return <ApartmentSkeleton />;
    if (!apartment) return <div className="p-10 text-center">Nie znaleziono apartamentu.</div>;

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((device, index) => (
                        <div
                            key={device.id || index}
                            className="p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-200 border border-base-200"
                        >
                            <span className="font-semibold text-sm text-base-content block">{device.name}</span>
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
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">

                <div className="w-full lg:w-96 space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
                        <figure className="bg-primary/10 p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                        </figure>
                        <div className="card-body">
                            <h1 className="card-title text-2xl font-bold">{apartment.name}</h1>
                            <div className="badge badge-secondary badge-outline">{apartment.city}, {apartment.street}</div>

                            <div className="mt-4 p-4 bg-base-200 rounded-lg">
                                <div className="text-2xl font-black text-primary">{apartment.pricePerMonth} PLN</div>
                                <div className="text-xs opacity-60 uppercase tracking-widest font-bold">Miesięcznie</div>
                            </div>

                            <div className="card-actions mt-6 flex flex-col gap-2">
                                {!isOwner && !isMember && (
                                    <button
                                        className="btn btn-primary w-full"
                                        disabled={applyToApartment.isPending}
                                        onClick={() => applyToApartment.mutate(apartment.id)}
                                    >
                                        Aplikuj o mieszkanie
                                    </button>
                                )}
                                {isOwner && (
                                    <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-warning w-full">
                                        Edytuj ogłoszenie
                                    </NavLink>
                                )}
                                <NavLink to="/apartments" className="btn btn-ghost w-full">Wróć do listy</NavLink>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-outline btn-block" onClick={() => setMapOpen(!mapOpen)}>
                        {mapOpen ? 'Ukryj mapę' : 'Pokaż na mapie'}
                    </button>
                    {mapOpen && (
                        <div className="h-64 rounded-xl overflow-hidden border border-base-300 shadow-inner">
                            <MapComponent position={[apartment.latitude, apartment.longitude]} location={apartment.name} />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
                        <figure className="bg-primary/10 p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                        </figure>

                        <div className="card-body">
                            <div role="tablist" className="tabs tabs-bordered">
                                <button
                                    role="tab"
                                    className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Szczegóły
                                </button>
                                {isMember && (
                                    <div>
                                        <button
                                            role="tab"
                                            className={`tab ${activeTab === 'faults' ? 'tab-active' : ''}`}
                                            onClick={() => setActiveTab('faults')}
                                        >
                                            Usterki
                                            {activeFaultsCount > 0 && <span className="badge badge-error badge-xs ml-2 text-white">{activeFaultsCount}</span>}
                                        </button>

                                        <button
                                            role="tab"
                                            className={`tab ${activeTab === 'bills' ? 'tab-active' : ''}`}
                                            onClick={() => setActiveTab('bills')}
                                        >
                                            Rachunki
                                        </button>
                                    </div>
                                )}
                            </div>

                            {activeTab === 'details' && (
                                <div className="mt-6 animate-fade-in space-y-8">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">Opis nieruchomości</h2>
                                        <p className="text-base-content/80 leading-relaxed whitespace-pre-line">{apartment.description}</p>
                                    </div>

                                    <div className="pt-4 border-t border-base-200">
                                        {renderDeviceSection("Sprzęt i Urządzenia", appliances, <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>)}
                                        {renderDeviceSection("Udogodnienia", amenities, <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>)}
                                        {renderDeviceSection("Pozostałe", others, <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)}
                                        {apartment.devices.length === 0 && <div className="alert bg-base-200 text-sm">Brak informacji o wyposażeniu.</div>}
                                    </div>

                                    {(isOwner || isMember) && (
                                        <div className="pt-6 border-t border-base-200">
                                            <h3 className="font-bold text-sm uppercase tracking-wide opacity-70 mb-4">Mieszkańcy</h3>
                                            <div className="flex flex-wrap gap-4">
                                                {apartment.apartmentMembers?.map((memb: ApartmentMember) => (
                                                    <ProfileAvatarCard key={memb.user.id} profile={memb.user} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {isOwner && (
                                        <div className="pt-6 border-t border-base-200">
                                            <h3 className="text-lg font-bold mb-4">Zarządzanie członkami</h3>
                                            <div className="overflow-x-auto">
                                                <ApartmentMembersTable apartment={apartment} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Treść zakładki Usterki */}
                            {activeTab === 'faults' && (
                                <div className="mt-6 animate-fade-in">
                                    <FaultList
                                        devices={apartment.devices}
                                        isOwner={isOwner}
                                        onAddClick={() => setFaultModalOpen(true)}
                                    />
                                    <FaultCreateDialog
                                        isOpen={isFaultModalOpen}
                                        onClose={() => setFaultModalOpen(false)}
                                        devices={apartment.devices}
                                    />
                                </div>
                            )}

                            {/* Treść zakładki Rachunki */}
                            {activeTab === 'bills' && (
                                <div className="mt-6 animate-fade-in">
                                    <ApartmentBills isOwner={isOwner} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}