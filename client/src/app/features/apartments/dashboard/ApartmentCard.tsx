import { NavLink } from "react-router"
import type { Apartment } from "../../../../lib/types"
import { useAccount } from "../../../../lib/hooks/useAccounts"

type Props = {
    apartment: Apartment
}

export default function ApartmentCard({ apartment }: Props) {
    const { currentUser } = useAccount();
    const isOwner = currentUser?.userRole === "Owner";

    return (
        <div className="card bg-base-50 w-auto shadow-sm">
            <figure className="m-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="125" height="250" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            </figure>
            <div className="card-body p-2">
                <h2 className="card-title text-sm">{apartment.name}</h2>
                <h2 className="card-title text-sm">{apartment.pricePerMonth} PLN Per month</h2>
                <p className="text-xs">{apartment.description}</p>
                <div className="card-actions justify-end">
                    {isOwner && (

                        <NavLink to="/createApartment" className="btn btn-primary btn-sm">Edit</NavLink>
                    )}
                    <NavLink to={`/apartments/${apartment.id}`} className="btn btn-primary btn-sm">Details</NavLink>
                </div>
            </div>
        </div>
    )
}
