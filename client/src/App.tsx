import { useEffect, useState } from "react"

function App() {

  const [apartmens, setApartmens] = useState<Apartment[]>([]);

  useEffect(() => {
    fetch('https://localhost:5001/api/apartments')
      .then(response => response.json())
      .then(data => setApartmens(data))

    return () => { }
  }, [])

  return (
    <>
      <button className="btn btn-primary">Button</button>
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
