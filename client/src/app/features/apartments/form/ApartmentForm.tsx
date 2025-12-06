import { useNavigate, useParams } from "react-router"
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { apartmentSchema, type ApartmentSchema } from "../../../../lib/schemas/apartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../shared/components/TextInput";

export default function ApartmentForm() {
    const { control, reset, handleSubmit } = useForm<ApartmentSchema>({
        mode: 'onTouched',
        resolver: zodResolver(apartmentSchema),
        defaultValues: {
            name: '',
            description: '',
            city: '',
            street: '',
            price: 0,
            buildingNumber: '',
            apartmentNumber: '',
        }
    });
    const { id } = useParams();
    const { apartment, createApartment, updateApartment } = useApartments(id);
    const navigate = useNavigate();

    useEffect(() => {
        if (apartment) reset(apartment);
    }, [apartment, reset]);

    const onSubmit = (data: ApartmentSchema) => {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextInput<ApartmentSchema> label="Name" name="name" control={control} defaultValue=""/>
                <TextInput<ApartmentSchema> label="Description" name="description" control={control} defaultValue=""/>
                {/* <TextInput<ApartmentSchema> label="Price" name="price" control={control} defaultValue={0}/> */}
                <TextInput<ApartmentSchema> label="City" name="city" control={control} defaultValue=""/>
                <TextInput<ApartmentSchema> label="Street" name="street" control={control} defaultValue=""/>
                <TextInput<ApartmentSchema> label="Building number" name="buildingNumber" control={control} defaultValue=""/>
                <TextInput<ApartmentSchema> label="Apartment number" name="apartmentNumber" control={control} defaultValue=""/>
                <div>
                    <button className="btn">Cancel</button>
                    <button className="btn">Submit</button>
                </div>
            </div>
        </form>
    )
}
