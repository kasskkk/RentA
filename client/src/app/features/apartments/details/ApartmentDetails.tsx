import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ApartmentSkeleton from "../../../shared/components/ApartmentSkeleton";
import ApartmentMembersTable from "../../../shared/components/ApartmentMembersTable";
import ProfileAvatarCard from "../../profiles/ProfileAvatarCard";

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
    const isOwner = currentUser?.userRole === "Owner";

    if (isPendingApartment) return <ApartmentSkeleton />;
    if (!apartment) return <div className="p-10 text-center">Nie znaleziono apartamentu.</div>;

    // Filtrowanie urządzeń na kategorie
    const appliances = apartment.devices.filter(d => APPLIANCES.includes(d.name));
    const amenities = apartment.devices.filter(d => AMENITIES.includes(d.name));
    const others = apartment.devices.filter(d => !APPLIANCES.includes(d.name) && !AMENITIES.includes(d.name));

    const renderDeviceSection = (title: string, items: typeof apartment.devices, icon: React.ReactNode) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-8">
                <h3 className="font-bold text-lg text-base-content mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
                    {icon}
                    {title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((device, index) => (
                        <div key={device.id || index} className="p-4 rounded-xl bg-base-200/50 border border-base-300">
                            <span className="font-bold text-sm block">{device.name}</span>
                            <p className="text-xs text-base-content/60 mt-1">
                                {device.description || <span className="italic opacity-50">Brak opisu</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* LEWA KOLUMNA: Sidebar / Info Główne */}
                <div className="w-full lg:w-96 space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
                        <figure className="bg-primary/10 p-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                        </figure>
                        <div className="card-body">
                            <div className="flex justify-between items-end mb-2">
                                <h1 className="card-title text-2xl font-bold">{apartment.name}</h1>
                            </div>
                            <div className="badge badge-secondary badge-outline">{apartment.city}, {apartment.street}</div>

                            <div className="mt-4 p-4 bg-base-200 rounded-lg">
                                <div className="text-2xl font-black text-primary">{apartment.pricePerMonth} PLN</div>
                                <div className="text-xs opacity-60 uppercase tracking-widest font-bold">Miesięcznie</div>
                            </div>

                            <div className="card-actions mt-6 flex flex-col gap-2">
                                {!isOwner && (
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

                    {/* Mała Mapa w Sidebarze */}
                    <button className="btn btn-outline btn-block" onClick={() => setMapOpen(!mapOpen)}>
                        {mapOpen ? 'Ukryj mapę' : 'Pokaż na mapie'}
                    </button>
                    {mapOpen && (
                        <div className="h-64 rounded-xl overflow-hidden border border-base-300 shadow-inner">
                            <MapComponent
                                position={[apartment.latitude, apartment.longitude]}
                                location={apartment.name}
                            />
                        </div>
                    )}
                </div>

                {/* PRAWA KOLUMNA: Szczegóły i Wyposażenie */}
                <div className="flex-1 space-y-8">
                    <section className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
                        <h2 className="text-xl font-bold mb-4">Opis nieruchomości</h2>
                        <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
                            {apartment.description}
                        </p>
                    </section>

                    <section className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
                        {renderDeviceSection("Sprzęt i Urządzenia", appliances, (
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        ))}

                        {renderDeviceSection("Udogodnienia", amenities, (
                            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        ))}

                        {renderDeviceSection("Pozostałe", others, (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ))}

                        {apartment.devices.length === 0 && (
                            <div className="alert bg-base-200">Brak szczegółowych informacji o wyposażeniu.</div>
                        )}
                    </section>

                    {/* Sekcja dla Właściciela: Mieszkańcy i Tabela */}
                    {isOwner && (
                        <div className="space-y-8">
                            <section className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-primary rounded-full"></span>
                                    Aktualni mieszkańcy
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {apartment.apartmentMembers?.map(memb => (
                                        <ProfileAvatarCard key={memb.user.id} profile={memb.user} />
                                    ))}
                                    {(!apartment.apartmentMembers || apartment.apartmentMembers.length === 0) && (
                                        <p className="text-sm italic opacity-50">Brak przypisanych mieszkańców.</p>
                                    )}
                                </div>
                            </section>

                            <section className="bg-base-100 p-6 rounded-2xl shadow-xl border border-primary/20">
                                <h3 className="text-lg font-bold mb-4">Zarządzanie członkami</h3>
                                <div className="overflow-x-auto">
                                    <ApartmentMembersTable apartment={apartment} />
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}