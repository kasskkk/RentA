import { NavLink, useParams } from "react-router";
import { useApartments } from "../../../../lib/hooks/useApartments";
import { useState } from "react";
import MapComponent from "../../../shared/components/MapComponent";

export default function ApartmentDetails() {
    const { id } = useParams();
    const { apartment, isPendingApartment } = useApartments(id);
    const [mapOpen, setMapOpen] = useState(false);

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
                <button className="btn" onClick={() => setMapOpen(!mapOpen)}>{mapOpen ? 'Hide map' : 'Open map'}</button>
                {mapOpen && (
                    <div>
                        <MapComponent 
                        position={[apartment.latitude, apartment.longitude]} 
                        location={apartment.name}
                        />
                    </div>
                )}
                <div className="card-actions justify-end">
                    <NavLink to="/apartments" className="btn btn-primary">Back</NavLink>
                    <NavLink to={`/editApartment/${apartment.id}`} className="btn btn-inherit">Edit</NavLink>
                </div>
            </div>
        </div>
    )
}
