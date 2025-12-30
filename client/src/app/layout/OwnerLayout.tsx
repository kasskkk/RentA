import { Outlet } from 'react-router'
import NavBar from './NavBar'
import SideBar from './SideBar'

export default function OwnerLayout() {
    return (
        <div className="flex flex-col h-screen">

            {/* Navbar */}
            <NavBar />

            <div className="drawer lg:drawer-open ">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex flex-col overflow-y-auto">
                    {/* Page content here */}
                    <div className="p-4 ">
                        <Outlet />
                    </div>
                </div>

                {/* Sidebar */}
                <SideBar />
            </div>
        </div>
    )
}
