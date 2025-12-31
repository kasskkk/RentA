import { useNavigate, useParams } from "react-router"
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import LocationInput from "../../../shared/components/LocationInput";
import NumberInput from "../../../shared/components/NumberInput";
import type { Apartment } from "../../../../lib/types";

export default function ApartmentForm() {
    const { control, reset, handleSubmit } = useForm({
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextInput label="Name" name="name" control={control} defaultValue="" />
                <TextInput label="Description" name="description" control={control} defaultValue="" />
                <NumberInput label="Price" name="pricePerMonth" control={control} defaultValue={0} />
                <NumberInput label="Rooms" name="rooms" control={control} defaultValue={0} />
                <NumberInput label="Area" name="area" control={control} defaultValue={0} />
                <TextInput label="City" name="city" control={control} defaultValue="" />
                <TextInput label="Street" name="street" control={control} defaultValue="" />
                <TextInput label="Building number" name="buildingNumber" control={control} defaultValue="" />
                <TextInput label="Apartment number" name="apartmentNumber" control={control} defaultValue="" />

                <LocationInput label="Location" control={control} name="location" />
                <div>
                    <button type="button" className="btn">Cancel</button>
                    <button type="submit" className="btn">Submit</button>
                </div>
            </div>
        </form>
    )
}
