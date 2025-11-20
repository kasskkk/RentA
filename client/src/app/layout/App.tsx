import axios from "axios";
import { useEffect, useState } from "react"
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ApartmentDashboard from "../features/apartments/dashboard/ApartmentDashboard";

function App() {

  const [apartments, setApartmens] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Apartment[]>('https://localhost:5001/api/apartments')
      .then(response => setApartmens(response.data))

    return () => { }
  }, [])

  const handleSelectApartment = (id: string) => {
    setSelectedApartment(apartments.find(x => x.id === id));
  }

  const handleCancelSelectApartment = () => {
    setSelectedApartment(undefined);
  }

  const handleOpenForm = (id?: string) => {
    if (id) handleSelectApartment(id);
    else handleCancelSelectApartment();
    setEditMode(true);
  }

  const handleCloseForm = () => {
    setEditMode(false);
  }

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
              <ApartmentDashboard apartments={apartments} selectApartment={handleSelectApartment} cancelSelectApartment={handleCancelSelectApartment} editMode={editMode} openForm={handleOpenForm} closeForm={handleCloseForm} />
            </div>
          </div>
          {/* Sidebar */}
          <SideBar openForm={handleOpenForm} />
        </div>
      </div>
    </>
  )
}

export default App
