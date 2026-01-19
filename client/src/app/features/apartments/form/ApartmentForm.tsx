import { useNavigate, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import LocationInput from "../../../shared/components/LocationInput";
import NumberInput from "../../../shared/components/NumberInput";
import type { Apartment, Photo } from "../../../../lib/types";
import TextAreaInput from "../../../shared/components/TextAreaInput";
import GeneratedTextInput from "../../../shared/components/GeneratedTextInput";
import PhotoApartmentUploadWidget from "../../../shared/components/PhotoApartmentUploadWidget";

const APPLIANCES = [
    "Telewizor", "Lodówka", "Pralka", "Zmywarka",
    "Klimatyzacja", "Mikrofalówka", "Żelazko", "Suszarka do włosów"
];

const AMENITIES = [
    "Internet (WiFi)", "Balkon / Taras", "Garaż / Parking",
    "Winda", "Ogród", "Basen", "Siłownia", "Recepcja / Ochrona"
];

export default function ApartmentForm() {
    const { control, reset, handleSubmit, setValue, register } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(apartmentSchema),
        defaultValues: {
            name: '',
            description: '',
            pricePerMonth: 0,
            isAvailable: false,
            rooms: 0,
            area: 0,
            maxOccupants: 0,
            city: '',
            street: '',
            buildingNumber: '',
            apartmentNumber: '',
            devices: [] as { name: string; brand?: string; description?: string }[],
            photos: [] as Photo[],
            location: { longitude: 0, latitude: 0 }
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "devices"
    });

    const { id } = useParams();
    const { apartment, updateApartment, createApartment, uploadApartmentPhoto } = useApartments(id);
    const navigate = useNavigate();

    const city = useWatch({ control, name: 'city' });
    const street = useWatch({ control, name: 'street' });
    const bldNum = useWatch({ control, name: 'buildingNumber' });
    const aptNum = useWatch({ control, name: 'apartmentNumber' });
    const watchedPhotos = useWatch({ control, name: 'photos' });

    useEffect(() => {
        const generatedName = `${city || ''}${street ? `, ${street}` : ''}${bldNum ? ` ${bldNum}` : ''}${aptNum ? `/${aptNum}` : ''}`;
        setValue('name', generatedName.trim());
    }, [city, street, bldNum, aptNum, setValue]);

    useEffect(() => {
        if (apartment) {
            reset({
                ...apartment,
                location: {
                    latitude: apartment.latitude,
                    longitude: apartment.longitude
                }
            });
        }
    }, [apartment, reset]);

    const onSubmit = async (data: ApartmentSchema) => {
        const { location, ...rest } = data;
        const flattenedData = { ...rest, ...location };
        try {
            if (apartment) {
                updateApartment.mutate({ ...apartment, ...flattenedData } as Apartment, {
                    onSuccess: () => navigate(`/apartments/${apartment.id}`)
                });
            } else {
                createApartment.mutate(flattenedData as unknown as Apartment, {
                    onSuccess: (newId) => navigate(`/apartments/${newId}`)
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderDeviceSection = (title: string, items: string[], icon: React.ReactNode) => (
        <div className="card bg-base-200 shadow-sm border border-base-300 mb-4">
            <div className="card-body p-5">
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2 mb-4">
                    {icon}
                    {title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((deviceName) => {
                        const fieldIndex = fields.findIndex((f) => f.name === deviceName);
                        const isSelected = fieldIndex !== -1;
                        return (
                            <div key={deviceName} className={`rounded-lg border transition-all duration-200 flex flex-col ${isSelected ? 'border-primary bg-base-100 shadow-sm' : 'border-base-300 hover:border-base-content/30'}`}>
                                <label className="label cursor-pointer p-3 w-full">
                                    <span className={`label-text font-medium ${isSelected ? 'text-primary' : ''}`}>{deviceName}</span>
                                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={isSelected} onChange={(e) => {
                                        if (e.target.checked) append({ name: deviceName, description: '' });
                                        else remove(fieldIndex);
                                    }} />
                                </label>
                                {isSelected && (
                                    <div className="px-3 pb-3 pt-0">
                                        <input type="text" {...register(`devices.${fieldIndex}.description`)} placeholder="Opis (opcjonalnie)..." className="input input-sm input-bordered w-full text-sm focus:outline-none focus:border-primary bg-base-200/50" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen items-start justify-center bg-base-100 p-4 pt-10">
            <div className="card w-full max-w-4xl bg-base-200 shadow-xl border border-base-300">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body gap-6">
                    
                    {/* Header z przyciskiem do zdjęć */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-base-300 pb-4 gap-4">
                        <h2 className="card-title text-2xl font-bold">
                            {apartment ? 'Edytuj mieszkanie' : 'Dodaj nowe mieszkanie'}
                        </h2>
                        
                        {id && (
                            <button 
                                type="button" 
                                className="btn btn-primary btn-outline btn-sm gap-2"
                                onClick={() => (document.getElementById('photo_modal') as HTMLDialogElement).showModal()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                Zarządzaj zdjęciami ({watchedPhotos?.length || 0})
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        <GeneratedTextInput name="name" control={control} readOnly={true} label="Generowana nazwa" className="pointer-events-none bg-base-100 font-bold border-primary/20" />
                        <TextAreaInput label="Opis" name="description" control={control} defaultValue="" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-300 p-4 rounded-lg">
                            <NumberInput label="Cena za miesiąc" name="pricePerMonth" control={control} defaultValue={0} />
                            <NumberInput label="Liczba pokoi" name="rooms" control={control} defaultValue={0} />
                            <NumberInput label="(m²)" name="area" control={control} defaultValue={0} />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm uppercase text-base-content/60 border-b border-base-300 pb-1">Dane lokalizacji</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Miasto" name="city" control={control} defaultValue="" />
                                <TextInput label="Ulicy" name="street" control={control} defaultValue="" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <TextInput label="Numer budynku" name="buildingNumber" control={control} defaultValue="" />
                                <TextInput label="Numer mieszkania" name="apartmentNumber" control={control} defaultValue="" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {renderDeviceSection("Sprzęt i Urządzenia", APPLIANCES, <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>)}
                            {renderDeviceSection("Udogodnienia", AMENITIES, <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>)}
                        </div>

                        <div className="border-t border-base-300 pt-4">
                            <LocationInput label="Pin na Mapie" control={control} name="location" />
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-6 pt-4 border-t border-base-300">
                        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Anuluj</button>
                        <button type="submit" className="btn btn-primary px-8">
                            {apartment ? 'Zapisz zmiany' : 'Dodaj ogłoszenie'}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- MODAL DIALOG --- */}
            <dialog id="photo_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-11/12 max-w-5xl bg-base-200 p-0 overflow-hidden border border-base-300 shadow-2xl">
                    {/* Przycisk zamknięcia w rogu */}
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50">✕</button>
                    </form>

                    <div className="p-6">
                        <h3 className="font-bold text-2xl mb-1">Zarządzanie zdjęciami</h3>
                        <p className="text-sm opacity-60 mb-6">Dodaj nowe zdjęcia lub przejrzyj obecną galerię (max 20).</p>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Widget Uploadu (7 kolumn) */}
                            <div className="lg:col-span-7 bg-base-100 p-4 rounded-2xl border border-base-300 shadow-inner">
                                <PhotoApartmentUploadWidget
                                    uploadPhoto={(file) => {
                                        uploadApartmentPhoto.mutate({ id: id!, file }, {
                                            onSuccess: () => {
                                                // Tutaj opcjonalnie powiadomienie o sukcesie
                                            }
                                        });
                                    }}
                                    loading={uploadApartmentPhoto.isPending}
                                />
                            </div>

                            {/* Podgląd Galerii (5 kolumn) */}
                            <div className="lg:col-span-5 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold uppercase text-xs tracking-widest opacity-50">Twoja Galeria</span>
                                    <span className="badge badge-ghost font-mono">{watchedPhotos?.length || 0}/20</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[450px] p-2 bg-base-300 rounded-xl border border-base-100 shadow-inner">
                                    {watchedPhotos?.map((photo) => (
                                        <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-base-100 group shadow-sm">
                                            <img src={photo.url} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" alt="Apartment" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                {/* Tutaj możesz dodać przycisk Delete */}
                                                <span className="text-white text-[10px] font-bold">ZOBACZ</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!watchedPhotos || watchedPhotos.length === 0) && (
                                        <div className="col-span-full py-20 text-center flex flex-col items-center opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mb-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <p className="italic text-sm font-medium text-center">Dodaj pierwsze zdjęcie,<br/>aby je tu zobaczyć.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action p-4 bg-base-300/50 border-t border-base-300">
                        <form method="dialog">
                            <button className="btn btn-primary px-10">Zamknij</button>
                        </form>
                    </div>
                </div>
                
                {/* Kliknięcie poza modalem również go zamyka */}
                <form method="dialog" className="modal-backdrop bg-black/60">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}