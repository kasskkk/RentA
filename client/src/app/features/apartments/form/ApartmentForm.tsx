import { useNavigate, useParams } from "react-router"
import { useApartments } from "../../../../lib/hooks/useApartments";
import type { FormEvent } from "react";

export default function ApartmentForm() {
    const { id } = useParams();
    const { apartment, createApartment, updateApartment } = useApartments(id);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data: { [key: string]: FormDataEntryValue } = {}
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (apartment) {
            data.id = apartment.id;
            await updateApartment.mutateAsync(data as unknown as Apartment);
            navigate(`/apartments/${apartment.id}`);
        } else {
            createApartment.mutate(data as unknown as Apartment, {
                onSuccess: (id) => {
                    navigate(`/apartments/${id}`);
                }
            });

        }
    }

    // if (isPendingApartment) return <h1>louding</h1>

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Name</legend>
                    <input type="text" className="input" name="name" defaultValue={apartment?.name} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Description</legend>
                    <input type="text" className="input rows=3" name="description" defaultValue={apartment?.description} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Price</legend>
                    <input type="number" className="input" name="price" defaultValue={apartment?.pricePerMonth} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">City</legend>
                    <input type="text" className="input" name="city" defaultValue={apartment?.city} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Street</legend>
                    <input type="text" className="input" name="street" defaultValue={apartment?.street} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Building number</legend>
                    <input type="text" className="input" name="buildingNumber" defaultValue={apartment?.buildingNumber} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Apartment number</legend>
                    <input type="text" className="input" name="apartmentNumber" defaultValue={apartment?.apartmentNumber ?? ''} placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <div>
                    <button className="btn">Cancel</button>
                    <button className="btn">Submit</button>
                </div>
            </div>
        </form>
    )
}
