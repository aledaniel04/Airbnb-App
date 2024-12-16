import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"; 
import "leaflet-geosearch/dist/geosearch.css";

// Icono personalizado para Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Componente de búsqueda integrado
const SearchField = ({ setSelectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (event) => {
      const { x, y } = event.location;
      setSelectedLocation({ lat: y, lng: x, name: event.location.label });
      map.flyTo([y, x], 13);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

// Componente para mover el mapa a la ubicación actual
const MoveToCurrentLocation = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 13);
    }
  }, [selectedLocation, map]);

  return null;
};

// Sección principal del mapa
const MapSection = ({ selectedLocation, setSelectedLocation, handleLocationSelection }) => {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-2">
        ¿Dónde se encuentra tu espacio?
      </p>
      <div
        className="relative border border-gray-300 rounded-md overflow-hidden"
        style={{ height: "300px" }} // Altura fija
      >
        <MapContainer
          center={selectedLocation || { lat: 10.447623, lng: -73.247581 }}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={markerIcon}
            >
              <Popup>
                {selectedLocation.name || "Ubicación desconocida"}
              </Popup>
            </Marker>
          )}
          <SearchField setSelectedLocation={setSelectedLocation} />
          <MoveToCurrentLocation selectedLocation={selectedLocation} />
        </MapContainer>
      </div>
      <button
        type="button"
        onClick={handleLocationSelection}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Usar mi ubicación actual
      </button>
    </div>
  );
};

export default MapSection;
