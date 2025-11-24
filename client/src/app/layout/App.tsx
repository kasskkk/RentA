import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ApartmentDashboard from "../features/apartments/dashboard/ApartmentDashboard";
import { useApartments } from "../../lib/hooks/useApartments";

function App() {
  const { apartments, isPending } = useApartments();

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
              {!apartments || isPending ? (
                <h1>
                  laduje sie
                </h1>
              ) : (
                <ApartmentDashboard apartments={apartments} />
              )}
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
