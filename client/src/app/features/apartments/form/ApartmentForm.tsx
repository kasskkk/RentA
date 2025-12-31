import { useNavigate, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import LocationInput from "../../../shared/components/LocationInput";
import NumberInput from "../../../shared/components/NumberInput";
import type { Apartment } from "../../../../lib/types";
import TextAreaInput from "../../../shared/components/TextAreaInput";
import GeneratedTextInput from "../../../shared/components/GeneratedTextInput";

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
            location: { longitude: 0, latitude: 0 }
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "devices"
    });

    const { id } = useParams();
    const { apartment, updateApartment, createApartment } = useApartments(id);
    const navigate = useNavigate();

    const city = useWatch({ control, name: 'city' });
    const street = useWatch({ control, name: 'street' });
    const bldNum = useWatch({ control, name: 'buildingNumber' });
    const aptNum = useWatch({ control, name: 'apartmentNumber' });

    // Automatyczne generowanie nazwy
    useEffect(() => {
        const generatedName = `${city || ''}${street ? `, ${street}` : ''}${bldNum ? ` ${bldNum}` : ''}${aptNum ? `/${aptNum}` : ''}`;
        setValue('name', generatedName.trim());
    }, [city, street, bldNum, aptNum, setValue]);

    // Resetowanie formularza danymi z API
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
                            <div
                                key={deviceName}
                                className={`rounded-lg border transition-all duration-200 flex flex-col ${
                                    isSelected ? 'border-primary bg-base-100 shadow-sm' : 'border-base-300 hover:border-base-content/30'
                                }`}
                            >
                                <label className="label cursor-pointer p-3 w-full">
                                    <span className={`label-text font-medium ${isSelected ? 'text-primary' : ''}`}>
                                        {deviceName}
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-sm"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                append({ name: deviceName, description: '' });
                                            } else {
                                                remove(fieldIndex);
                                            }
                                        }}
                                    />
                                </label>
                                {isSelected && (
                                    <div className="px-3 pb-3 pt-0">
                                        <input
                                            type="text"
                                            {...register(`devices.${fieldIndex}.description`)}
                                            placeholder="Opis (opcjonalnie)..."
                                            className="input input-sm input-bordered w-full text-sm focus:outline-none focus:border-primary bg-base-200/50"
                                        />
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
        <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
            <div className="card w-full max-w-2xl bg-base-200 shadow-xl border border-base-300">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body gap-6">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-base-300 pb-4">
                        <h2 className="card-title text-2xl font-bold">
                            {apartment ? 'Edit Apartment' : 'Add New Apartment'}
                        </h2>
                        <span className="badge badge-primary">Property</span>
                    </div>

                    <div className="space-y-6">
                        {/* Podstawowe informacje */}
                        <div className="grid grid-cols-1 gap-4">
                            <GeneratedTextInput
                                name="name"
                                control={control}
                                defaultValue=""
                                readOnly={true}
                                label="Generated name"
                                className="pointer-events-none select-none bg-base-100 text-base-content font-bold border-primary/20 opacity-100 shadow-sm"
                            />
                            <TextAreaInput label="Description" name="description" control={control} defaultValue="" />
                        </div>

                        {/* Parametry liczbowe */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-300 p-4 rounded-lg">
                            <NumberInput label="Price (per month)" name="pricePerMonth" control={control} defaultValue={0} />
                            <NumberInput label="Rooms" name="rooms" control={control} defaultValue={0} />
                            <NumberInput label="Area (m²)" name="area" control={control} defaultValue={0} />
                        </div>

                        {/* Lokalizacja tekstowa */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm uppercase text-base-content/60 border-b border-base-300 pb-1">Location Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="City" name="city" control={control} defaultValue="" />
                                <TextInput label="Street" name="street" control={control} defaultValue="" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <TextInput label="Building Number" name="buildingNumber" control={control} defaultValue="" />
                                <div className="relative">
                                    <TextInput label="Apartment Number" name="apartmentNumber" control={control} defaultValue="" />
                                    <span className="absolute right-2 top-0 text-xs text-base-content/50 italic mt-1">Optional</span>
                                </div>
                            </div>
                        </div>

                        {/* Wyposażenie i Udogodnienia */}
                        <div className="space-y-4">
                            {renderDeviceSection(
                                "Sprzęt i Urządzenia",
                                APPLIANCES,
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>
                            )}

                            {renderDeviceSection(
                                "Udogodnienia",
                                AMENITIES,
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                            )}
                        </div>

                        {/* Mapa */}
                        <div className="border-t border-base-300 pt-4">
                            <LocationInput label="Pin on Map" control={control} name="location" />
                        </div>
                    </div>

                    {/* Akcje formularza */}
                    <div className="card-actions justify-end mt-6 pt-4 border-t border-base-300">
                        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-8">
                            {apartment ? 'Save Changes' : 'Post Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}