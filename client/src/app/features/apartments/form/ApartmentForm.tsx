import { useParams } from "react-router"
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";
import LocationInput from "../../../shared/components/LocationInput";

export default function ApartmentForm() {
    const { control, reset, handleSubmit } = useForm<ApartmentSchema>({
        mode: 'onTouched',
        resolver: zodResolver(apartmentSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
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
    const { id } = useParams();
    const { apartment } = useApartments(id);

    useEffect(() => {
        if (apartment) reset(apartment);
    }, [apartment, reset]);

    const onSubmit = (data: ApartmentSchema) => {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextInput<ApartmentSchema> label="Name" name="name" control={control} defaultValue="" />
                <TextInput<ApartmentSchema> label="Description" name="description" control={control} defaultValue="" />
                {/* <TextInput<ApartmentSchema> label="Price" name="price" control={control} defaultValue={0}/> */}
                <LocationInput<ApartmentSchema> label="Location" control={control} name="location.city" />
                <div>
                    <button className="btn">Cancel</button>
                    <button className="btn">Submit</button>
                </div>
            </div>
        </form>
    )
}
