import axios from "axios";
import { useEffect, useState } from "react"

function App() {

  const [apartmens, setApartmens] = useState<Apartment[]>([]);

  useEffect(() => {
    axios.get<Apartment[]>('https://localhost:5001/api/apartments')
      .then(response => setApartmens(response.data))

    return () => { }
  }, [])

  return (
    <>   
      <h3 className="app" style={{ color: 'red' }}>RentA</h3>
      <ul>
        {apartmens.map((apartment) => (
          <li key={apartment.id}>{apartment.name}</li>
        ))}
      </ul>
    </>
  )
}

export default App
