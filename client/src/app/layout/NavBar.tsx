import { NavLink, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccounts"
import { useApartmentStore } from "../../lib/stores/useApartmentStore";
import { useState } from "react";

export default function NavBar() {
    const { currentUser, logoutUser } = useAccount();
    const location = useLocation();
    const isApartmentsPage = location.pathname === "/apartments"
    const { setFilter } = useApartmentStore();

    const [localFilters, setLocalFilters] = useState({
        keyWord: '',
        city: '',
        pricePerMonth: undefined as number | undefined,
        rooms: undefined as number | undefined
    });

    const handleSearch = () => {
        setFilter('keyWord', localFilters.keyWord);
        setFilter('city', localFilters.city);
        setFilter('pricePerMonth', localFilters.pricePerMonth);
        setFilter('rooms', localFilters.rooms);
    };

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
                <div className="hidden lg:flex flex-[3] justify-center">
                    <div className="flex items-center bg-base-200 p-1.5 rounded-2xl gap-2 border border-base-300 w-full max-w-3xl">

                        <div className="flex items-center px-3 gap-2 flex-1 border-r border-base-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                className="bg-transparent outline-none text-sm w-full"
                                value={localFilters.keyWord}
                                onChange={(e) => setLocalFilters({ ...localFilters, keyWord: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center px-3 gap-2 flex-1 border-r border-base-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            <input
                                type="text"
                                list="cities-data"
                                placeholder="Lokalizacja..."
                                className="bg-transparent outline-none text-sm w-full"
                                value={localFilters.city}
                                onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
                            />
                            <datalist id="cities-data">
                                <option value="Warszawa" />
                                <option value="Kraków" />
                                <option value="Wrocław" />
                                <option value="Gdańsk" />
                                <option value="Poznań" />
                            </datalist>
                        </div>

                        <div className="flex items-center px-3 gap-2 flex-1">
                            <span className="text-xs font-bold opacity-40">PLN</span>
                            <input
                                type="number"
                                placeholder="Cena do..."
                                className="bg-transparent outline-none text-sm w-full"
                                value={localFilters.pricePerMonth ?? ""}
                                onChange={(e) => setLocalFilters({
                                    ...localFilters,
                                    pricePerMonth: e.target.value ? Number(e.target.value) : undefined
                                })}
                            />
                        </div>

                        <div className="flex items-center px-1 relative group min-w-[120px]">
                            <span className="text-xs font-bold opacity-40 pr-2">Rooms</span>
                            <select
                                className="select select-sm focus:outline-none bg-transparent w-full pr-8 appearance-none"
                                value={localFilters.rooms ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocalFilters({
                                        ...localFilters,
                                        rooms: val === "" || val === "all" ? undefined : Number(val)
                                    });
                                }}
                            >
                                <option value="all">Any</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3+</option>
                            </select>

                        </div>

                        <button
                            onClick={handleSearch}
                            className="btn btn-primary btn-sm rounded-xl px-6"
                        >
                            Szukaj
                        </button>
                    </div>
                </div>
            )}
            <div className="ml-auto dropdown dropdown-end">
                <div tabIndex={-1} role="button" className="btn bg-base-300">
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            {currentUser?.imageUrl ? (
                                <img
                                    src={currentUser.imageUrl}
                                    alt={currentUser.displayName ?? "Użytkownik"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 font-semibold">
                                    {currentUser?.displayName?.[0]?.toUpperCase() ?? "U"}
                                </div>
                            )}
                        </div>
                    </div>
                    <span >{currentUser?.displayName}</span>
                </div>
                <ul
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <NavLink to={`/profiles/${currentUser?.id}`}>
                            <div className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </div>
                        </NavLink>
                    </li>
                    <li><a>Settings | Profile setting idk</a></li>
                    <li><button
                        onClick={() => { logoutUser.mutate() }}
                    >Logout</button></li>
                </ul>
            </div>
        </nav>
    )
}
