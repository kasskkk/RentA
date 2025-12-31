import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";
import { useAccount } from "../../../../lib/hooks/useAccounts";
import ProfileAvatarCard from "../../profiles/ProfileAvatarCard";

// Stałe listy kategorii (te same co w formularzu)
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

    if (!apartment) return <div>nie ma</div>
    if (isPendingApartment) return <div>ladddduje</div>

    // Filtrowanie urządzeń
    const appliances = apartment.devices.filter(d => APPLIANCES.includes(d.name));
    const amenities = apartment.devices.filter(d => AMENITIES.includes(d.name));
    const others = apartment.devices.filter(d => !APPLIANCES.includes(d.name) && !AMENITIES.includes(d.name));

    // Funkcja pomocnicza do renderowania sekcji
    const renderDeviceSection = (title: string, items: typeof apartment.devices, icon: React.ReactNode) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6">
                <h3 className="font-bold text-md text-base-content mb-3 flex items-center gap-2 border-b border-base-200 pb-2">
                    {icon}
                    {title}
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
        // 👇 ZMIANA TUTAJ: Usunięto 'mx-auto', dodano 'w-full max-w-4xl'
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

                <p className="mt-4 text-base-content/80 leading-relaxed text-lg">{apartment.description}</p>

                {/* --- SEKCJE WYPOSAŻENIA --- */}
                <div className="mt-8 pt-4 border-t border-base-300">

                    {/* Sekcja 1: Sprzęt */}
                    {renderDeviceSection(
                        "Sprzęt i Urządzenia",
                        appliances,
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>
                    )}

                    {/* Sekcja 2: Udogodnienia */}
                    {renderDeviceSection(
                        "Udogodnienia",
                        amenities,
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    )}

                    {/* Sekcja 3: Pozostałe */}
                    {renderDeviceSection(
                        "Pozostałe",
                        others,
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                    )}

                    {apartment.devices.length === 0 && (
                        <div className="alert bg-base-200 text-sm py-3">
                            <span>Brak informacji o wyposażeniu.</span>
                        </div>
                    )}
                </div>


                <div className="mt-6 flex flex-col gap-4">
                    <button className="btn btn-outline btn-sm w-full md:w-auto self-start" onClick={() => setMapOpen(!mapOpen)}>
                        {mapOpen ? 'Ukryj mapę' : 'Pokaż na mapie'}
                    </button>

                    {mapOpen && (
                        <div className="rounded-lg overflow-hidden border border-base-300 h-96 w-full">
                            <MapComponent
                                position={[apartment.latitude, apartment.longitude]}
                                location={apartment.name}
                            />
                        </div>
                    )}
                </div>

                {isOwner && (
                    <div className="mt-8 pt-6 border-t border-base-300">
                        <h3 className="font-bold text-sm uppercase tracking-wide opacity-70 mb-4">Mieszkańcy</h3>
                        <div className="flex flex-wrap gap-4">
                            {apartment.apartmentMembers.map(memb => (
                                <ProfileAvatarCard key={memb.user.id} profile={memb.user} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="card-actions justify-end mt-8 border-t border-base-200 pt-4">
                    <NavLink to="/apartments" className="btn btn-ghost">Wróć</NavLink>
                    {!isOwner && (
                        <button
                            className="btn btn-primary px-8"
                            disabled={applyToApartment.isPending}
                            onClick={() => applyToApartment.mutate(apartment.id)}
                        >
                            Aplikuj
                        </button>
                    )}
                    {isOwner && (
                        <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-primary">Edytuj</NavLink>
                    )}
                </div>
            </div>
        </div>
    )
}