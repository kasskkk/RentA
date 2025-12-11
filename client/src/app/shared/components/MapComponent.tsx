import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


type Props = {
    position: [number, number];
    location: string
}
export default function MapComponent({ position, location }: Props) {

    return (
        <>
            <MapContainer className="w-full h-80 rounded-box" center={position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        {location}
                    </Popup>
                </Marker>
            </MapContainer>,
        </>
    )
}
