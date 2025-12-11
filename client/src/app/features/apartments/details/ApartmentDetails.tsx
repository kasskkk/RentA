import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";

export default function ApartmentDetail() {
    const { id } = useParams();
    const { apartment, isPendingApartment } = useApartments(id);

    if (!apartment) return <div>nie ma</div>
    if (isPendingApartment) return <div>ladddduje</div>

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{apartment.name}</h2>
                <p>{apartment.description}</p>
                <div className="card-actions justify-end">
                    <NavLink to="/apartments" className="btn btn-primary">Back</NavLink>
                    <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-inherit">Edit</NavLink>
                </div>
            </div>
        </div>
    )
}
