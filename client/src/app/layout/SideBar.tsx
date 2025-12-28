import { NavLink } from "react-router";
import { useAccount } from "../../lib/hooks/useAccounts";

export default function SideBar() {
    const { currentUser } = useAccount();
    const isOwner = currentUser?.userRole === "Owner";

    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                {/* Sidebar content here */}
                <ul className="menu w-full grow">
                    {/* List item */}
                    <li>
                        <NavLink to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                            {/* Home icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                            <span className="is-drawer-close:hidden">Homepage</span>
                        </NavLink>
                    </li>

                    {/* List item */}
                    <li>
                        <NavLink to="/apartments" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Apartments" >
                            {/* Settings icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M12 6h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M8 6h.01" /><path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /><rect x="4" y="2" width="16" height="20" rx="2" /></svg>
                            <span className="is-drawer-close:hidden block truncate">Apartments</span>
                        </NavLink>
                    </li>

                    {isOwner && (

                        /* List item */
                        <li>
                            <NavLink to="/createApartment" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Create Apartment" >
                                {/* Settings icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                                <span className="is-drawer-close:hidden block truncate">Create Apartment</span>
                            </NavLink>
                        </li>
                    )}

                    {/* List item */}
                    <li>
                        <NavLink to="/errors" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="ErrorTest">
                            {/* Settings icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                            <span className="is-drawer-close:hidden">ErrorTest</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}
