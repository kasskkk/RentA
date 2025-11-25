import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router";

function App() {


  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <NavBar />
        {/* Drawer below navbar */}
        <div className="drawer lg:drawer-open flex-1">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <div className="p-4">
              <Outlet />
            </div>
          </div>
          {/* Sidebar */}
          <SideBar />
        </div>
      </div>
    </>
  )
}

export default App
