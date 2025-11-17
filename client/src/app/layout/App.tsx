import axios from "axios";
import { useEffect, useState } from "react"
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ApartmentDashboard from "../features/apartments/dashboard/ApartmentDashboard";

function App() {

  const [apartments, setApartmens] = useState<Apartment[]>([]);

  useEffect(() => {
    axios.get<Apartment[]>('https://localhost:5001/api/apartments')
      .then(response => setApartmens(response.data))

    return () => { }
  }, [])

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
              <ApartmentDashboard apartments={apartments} />
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
