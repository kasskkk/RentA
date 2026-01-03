import { Outlet } from "react-router";
import NavBar from "../NavBar";
import SideBar from "../SideBar";

export default function UserLayout() {
    return (
        <div className="drawer lg:drawer-open h-screen overflow-hidden">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col h-full overflow-hidden">
                <NavBar />

                <main className="flex-1 overflow-y-auto p-4 bg-base-100">
                    <Outlet />
                </main>
            </div>

            <SideBar />
        </div>
    )
}
