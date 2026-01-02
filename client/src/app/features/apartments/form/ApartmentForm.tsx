import { useNavigate, useParams } from "react-router"
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm, useWatch } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import LocationInput from "../../../shared/components/LocationInput";
import NumberInput from "../../../shared/components/NumberInput";
import type { Apartment } from "../../../../lib/types";
import TextAreaInput from "../../../shared/components/TextAreaInput";

export default function ApartmentForm() {
    const { control, reset, handleSubmit, setValue } = useForm({
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
            location: {
                longitude: 0,
                latitude: 0
            }
        }
    });
    const { id } = useParams();
    const { apartment } = useApartments(id);
    const { updateApartment, createApartment } = useApartments();
    const navigate = useNavigate();

    type ApartmentFormValues = ApartmentSchema & {
        location: {
            city?: string;
            buildingNumber?: string;
        }
    };

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
            const formData: ApartmentFormValues = {
                ...apartment,
                location: {
                    latitude: apartment.latitude,
                    longitude: apartment.longitude,
                    city: apartment.city,
                    buildingNumber: apartment.buildingNumber
                }
            };
            reset(formData);
        }
    }, [apartment, reset]);
    const onSubmit = async (data: ApartmentSchema) => {
        const { location, ...rest } = data;
        const flattenedData = { ...rest, ...location };
        console.log(data);
        try {
            if (apartment) {

                updateApartment.mutate({ ...apartment, ...flattenedData }, {
                    onSuccess: () => navigate(`/apartments/${apartment.id}`)
                })
            } else {
                createApartment.mutate(
                    flattenedData as Apartment,
                    {
                        onSuccess: (id) => navigate(`/apartments/${id}`)
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

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

                    <div className="grid grid-cols-1 gap-4">
                        <div className="opacity-80">
                            <TextInput
                                name="name"
                                control={control}
                                defaultValue=""
                                readOnly={true}
                                className="input input-bordered bg-base-100 text-base-content font-semibold border-primary/30 focus:outline-none cursor-default"
                                label={"Generated name"}
                            />
                        </div>
                        <TextAreaInput label="Description" name="description" control={control} defaultValue="" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-300 p-4 rounded-lg">
                        <NumberInput label="Price (per month)" name="pricePerMonth" control={control} defaultValue={0} />
                        <NumberInput label="Rooms" name="rooms" control={control} defaultValue={0} />
                        <NumberInput label="Area (m²)" name="area" control={control} defaultValue={0} />
                    </div>

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

                    <div className="border-t border-base-300 pt-4">
                        <LocationInput label="Pin on Map" control={control} name="location" />
                    </div>

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
    )
}
