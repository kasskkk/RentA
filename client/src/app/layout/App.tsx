import axios from "axios";
import { useEffect, useState } from "react"
import NavBar from "./NavBar";
import SideBar from "./SideBar";

function App() {

  const [apartments, setApartmens] = useState<Apartment[]>([]);

  useEffect(() => {
    axios.get<Apartment[]>('https://localhost:5001/api/apartments')
      .then(response => setApartmens(response.data))

    return () => { }
  }, [])

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <NavBar />
          {/* Page content here */}
          <div className="p-4">
            <ul>
              {apartments.map((apartment) => (
                <li key={apartment.id}>{apartment.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <SideBar />
      </div>
    </>
  )
}

export default App
