import { Outlet } from "react-router";
import NavBar from "../NavBar";
import SideBar from "../SideBar";

export default function UserLayout() {
    return (
        <div className="flex flex-col h-screen ">

            {/* Navbar */}
            <NavBar />

            <div className="drawer lg:drawer-open flex-1 ">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col h-full overflow-y-auto">
                    {/* Page content here */}
                    <h1>USSSSSSSSSSSSSSER</h1>
                    <div className="p-4">
                        <Outlet />
                    </div>
                </div>

                {/* Sidebar */}
                <SideBar />
            </div>
        </div>
    )
}
