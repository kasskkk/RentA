import { NavLink } from "react-router"
import type { Apartment } from "../../../../lib/types"

type Props = {
    apartment: Apartment
}

export default function ApartmentCard({ apartment }: Props) {

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 group overflow-hidden">
            <figure className="bg-gradient-to-br from-primary/20 to-secondary/20 py-8 relative">
                <div className="bg-white/50 p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <div className="absolute bottom-2 right-2 badge badge-secondary font-bold p-3 shadow-md">
                    {apartment.pricePerMonth} PLN
                </div>
            </figure>

            <div className="card-body p-5">
                <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{apartment.city}</div>
                    <h2 className="card-title text-xl text-base-content group-hover:text-primary transition-colors">
                        {apartment.name}
                    </h2>
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-base-200 my-2">
                    <div className="flex items-center gap-1">
                        <span className="text-base-content/50">📐</span>
                        <span className="text-sm font-semibold">{apartment.area} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-base-content/50">🚪</span>
                        <span className="text-sm font-semibold">{apartment.rooms} Pokoje</span>
                    </div>
                </div>

                <p className="text-sm text-base-content/60 line-clamp-2 italic">
                    {apartment.description}
                </p>

                <div className="card-actions justify-end mt-4">
                    <NavLink
                        to={`/apartments/${apartment.id}`}
                        className="btn btn-primary btn-sm px-6 shadow-lg shadow-primary/30"
                    >
                        Szczególy
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
