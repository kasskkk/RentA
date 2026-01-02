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
            devices: [] as { name: string, brand: string, description?: string }[],
            location: {
                longitude: 0,
                latitude: 0
            }
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
                updateApartment.mutate({ ...apartment, ...flattenedData }, {
                    onSuccess: () => navigate(`/apartments/${apartment.id}`)
                });
            } else {
                createApartment.mutate(
                    flattenedData as unknown as Apartment,
                    {
                        onSuccess: (newId) => navigate(`/apartments/${newId}`)
                    }
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
            <div className="card w-full max-w-2xl bg-base-200 shadow-xl border border-base-300">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body gap-6">

                    <div className="flex justify-between items-center border-b border-base-300 pb-4">
                        <h2 className="card-title text-2xl font-bold">
                            {apartment ? 'Edit Apartment' : 'Add New Apartment'}
                        </h2>
                        <span className="badge badge-primary">Property</span>
                    </div>

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
                        <h3 className="font-semibold text-sm uppercase text-base-content/60">Location Details</h3>
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

                    {/* Sekcja Wyposażenia (Devices) */}
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 17.25v-1.007c0-.197.105-.377.276-.474l.294-.168a2.5 2.5 0 0 0 1.33-2.193v-.832c0-.52-.132-1.026-.38-1.48l-1.338-2.341a.75.75 0 0 0-.65-.375H10.47a.75.75 0 0 0-.65.375l-1.338 2.341c-.248.454-.38.96-.38 1.48v.832c0 .927.502 1.776 1.33 2.193l.294.168c.17.097.276.277.276.474Z" />
                                    </svg>
                                    Wyposażenie
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => append({ name: '', brand: '', description: '' })}
                                >
                                    Dodaj
                                </button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="card bg-base-200 shadow-sm border border-base-300 relative">
                                        <div className="card-body p-4 pt-8">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="btn btn-xs btn-circle btn-error btn-outline absolute top-2 right-2"
                                            >
                                                ✕
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="form-control">
                                                    <label className="label py-1"><span className="label-text">Nazwa</span></label>
                                                    <input {...register(`devices.${index}.name`)} className="input input-bordered input-sm" placeholder="np. Lodówka" />
                                                </div>
                                                <div className="form-control">
                                                    <label className="label py-1"><span className="label-text">Marka</span></label>
                                                    <input {...register(`devices.${index}.brand`)} className="input input-bordered input-sm" placeholder="np. Bosch" />
                                                </div>
                                                <div className="form-control md:col-span-2">
                                                    <label className="label py-1"><span className="label-text">Opis</span></label>
                                                    <input {...register(`devices.${index}.description`)} className="input input-bordered input-sm" placeholder="Opcjonalne szczegóły" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {fields.length === 0 && (
                                    <div className="text-center py-4 text-base-content/50 border-2 border-dashed border-base-300 rounded-lg">
                                        Brak dodanych urządzeń.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="border-t border-base-300 pt-4">
                        <LocationInput label="Pin on Map" control={control} name="location" />
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