import { NavLink, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccounts"
import ApartmentFilters from "../features/apartments/filters/ApartmentFilters";

export default function NavBar() {
    const { currentUser, logoutUser } = useAccount();
    const location = useLocation();
    const isApartmentsPage = location.pathname === "/apartments"

    return (
        <nav className="navbar w-full bg-base-300 px-4">
            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                {/* Sidebar toggle icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                    <path d="M9 4v16"></path>
                    <path d="M14 10l2 2l-2 2"></path>
                </svg>
            </label>

            <div className="px-4">RenTa</div>
            <div className="divider divider-horizontal"></div>
            <span className="text-xl font-bold tracking-tight hidden md:block">
                Apart<span className="text-primary">Me</span>
            </span>

            {isApartmentsPage && (
                <ApartmentFilters />
            )}

            <div className="ml-auto dropdown dropdown-end">
                <div tabIndex={-1} role="button" className="btn bg-base-300 border-gray-250 border-2">
                    <div className="avatar">
                        <div className="w-9 h-9 rounded-full">
                            {currentUser?.imageUrl ? (
                                <img
                                    src={currentUser.imageUrl}
                                    alt={currentUser.displayName?.[0]}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 font-semibold">
                                        {currentUser?.displayName?.[0]?.toUpperCase() ?? "U"}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <span >{currentUser?.displayName}</span>
                </div>
                <ul
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <NavLink to={`/profiles/${currentUser?.id}`}>
                            <div>
                                Profil
                            </div>
                        </NavLink>
                    </li>
                    {/* <li><a>Settings | Profile setting idk</a></li> */}
                    <li><button
                        onClick={() => { logoutUser.mutate() }}
                    >Wyloguj</button></li>
                </ul>
            </div>
        </nav>
    )
}
