import { useNavigate, useParams } from "react-router"
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import LocationInput from "../../../shared/components/LocationInput";
import NumberInput from "../../../shared/components/NumberInput";
import type { Apartment } from "../../../../lib/types";

export default function ApartmentForm() {
    const { control, reset, handleSubmit, register, formState: { errors } } = useForm({
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
            devices: [] as { name: string, brand: string, description?: string }[],
            location: {
                city: '',
                street: '',
                buildingNumber: '',
                apartmentNumber: '',
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
    const { apartment } = useApartments(id);
    const { updateApartment, createApartment } = useApartments();
    const navigate = useNavigate();

    useEffect(() => {
        if (apartment) reset({
            ...apartment,
            devices: apartment.devices || [],
            location: {
                city: apartment.city,
                street: apartment.street,
                latitude: apartment.latitude,
                longitude: apartment.longitude,
                buildingNumber: apartment.buildingNumber || '',
                apartmentNumber: apartment.apartmentNumber || '',
            }
        });
    }, [apartment, reset]);

    const onSubmit = async (data: ApartmentSchema) => {
        const { location, ...rest } = data;
        const flattenedData = { ...rest, ...location };
        try {
            if (apartment) {
                updateApartment.mutate({ ...apartment, ...flattenedData }, {
                    onSuccess: () => navigate(`/apartments/${apartment.id}`)
                })
            } else {
                createApartment.mutate(
                    flattenedData as unknown as Apartment, // Wysyłamy płaski obiekt
                    {
                        onSuccess: (id) => navigate(`/apartments/${id}`)
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <TextInput label="Name" name="name" control={control} defaultValue="" />
                <TextInput label="Description" name="description" control={control} defaultValue="" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NumberInput label="Price" name="pricePerMonth" control={control} defaultValue={0} />
                    <NumberInput label="Rooms" name="rooms" control={control} defaultValue={0} />
                    <NumberInput label="Area" name="area" control={control} defaultValue={0} />
                </div>


                <div className="card bg-base-200 shadow-sm border border-base-300">
                    <div className="card-body p-5">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Dodaj
                            </button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="card bg-base-100 shadow-sm border border-base-200">
                                    <div className="card-body p-4 relative">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="btn btn-sm btn-square btn-outline btn-error absolute top-2 right-2"
                                            title="Usuń urządzenie"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div className="form-control w-full">
                                                <label className="label py-1">
                                                    <span className="label-text font-medium">Nazwa / Typ</span>
                                                </label>
                                                <input
                                                    {...register(`devices.${index}.name` as const)}
                                                    placeholder="np. Telewizor"
                                                    className="input input-bordered input-md w-full focus:input-primary"
                                                />
                                                {errors.devices?.[index]?.name && (
                                                    <label className="label py-1">
                                                        <span className="label-text-alt text-error">{errors.devices[index]?.name?.message}</span>
                                                    </label>
                                                )}
                                            </div>

                                            <div className="form-control w-full">
                                                <label className="label py-1">
                                                    <span className="label-text font-medium">Marka</span>
                                                </label>
                                                <input
                                                    {...register(`devices.${index}.brand` as const)}
                                                    placeholder="np. Samsung"
                                                    className="input input-bordered input-md w-full focus:input-primary"
                                                />
                                                {errors.devices?.[index]?.brand && (
                                                    <label className="label py-1">
                                                        <span className="label-text-alt text-error">{errors.devices[index]?.brand?.message}</span>
                                                    </label>
                                                )}
                                            </div>

                                            <div className="form-control w-full md:col-span-2">
                                                <label className="label py-1">
                                                    <span className="label-text font-medium">Opis</span>
                                                </label>
                                                <input
                                                    {...register(`devices.${index}.description` as const)}
                                                    placeholder="Szczegóły, model, stan..."
                                                    className="input input-bordered input-md w-full focus:input-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {fields.length === 0 && (
                                <div className="text-center py-6 text-base-content/50 border-2 border-dashed border-base-300 rounded-lg">
                                    Brak dodanych urządzeń.
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <LocationInput label="Location" control={control} name="location" />

                <div className="sticky bottom-0 z-10 mt-8 flex justify-end gap-3 border-t border-base-300 bg-base-100 py-4 pr-24">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate(-1)}
                    >
                        Anuluj
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary px-8"
                    >
                        Zapisz
                    </button>
                </div>
            </div>

        </form >
    )
}