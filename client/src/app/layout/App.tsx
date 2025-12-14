import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router";

function App() {


  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* Navbar */}
      <NavBar />

      <div className="drawer lg:drawer-open flex-1 overflow-hidden">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col h-full overflow-y-auto">
          {/* Page content here */}
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

export default App
