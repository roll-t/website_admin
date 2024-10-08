"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = ({ lat, lon }) => {
  useEffect(() => {
    if (lat === undefined || lon === undefined) {
      console.error("Latitude and Longitude must be provided");
    }
  }, [lat, lon]);

  if (lat === undefined || lon === undefined) {
    return null; // Return nothing if lat or lon is not provided
  }

  return (
    <MapContainer center={[lat, lon]} zoom={13} style={{ height: '400px', width: '100%' }} whenReady={() => console.log('Map loaded')}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lon]}>
        <Popup>
          {`Latitude: ${lat}, Longitude: ${lon}`}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
