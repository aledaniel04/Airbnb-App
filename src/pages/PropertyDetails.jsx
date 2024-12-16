import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyBySlug } from '../services/auth'; // Función para obtener datos de una propiedad

const PropertyDetails = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const data = await getPropertyBySlug(slug);
      setProperty(data);
    };

    fetchProperty();
  }, [slug]);

  if (!property) {
    return <div className="text-center mt-20">Cargando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {property.title}
      </h1>

      {/* Imagen Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <img
          src={property.photos[0]}
          alt="Imagen principal"
          className="w-full h-[20rem] md:h-[28rem] object-cover rounded-xl shadow-md col-span-2"
        />
        {property.photos.slice(1, 5).map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Imagen ${index}`}
            className="w-full h-32 md:h-48 object-cover rounded-lg shadow-sm"
          />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            {property.space_type} · {property.accommodation_type}
          </h2>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <p>🧑‍🤝‍🧑 {property.guest_count} Huéspedes</p>
            <p>🛏️ {property.room_count} Habitaciones</p>
            <p>🛋️ {property.bed_count} Camas</p>
            <p>🛁 {property.bathroom_count} Baños</p>
          </div>

          <hr className="my-4" />

          {/* Usuario que creó la propiedad */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="anonimo"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-800">Anfitrión: Anonimo</h3>
              <p className="text-sm text-gray-600">Superanfitrión</p>
            </div>
          </div>

          {/* Descripción */}
          <h3 className="text-lg font-semibold mb-1">Descripción</h3>
          <p>{property.description}</p>



          {/* Comodidades */}
          <h3 className="text-lg font-semibold mb-1 mt-2">Lo que ofrece este lugar</h3>
          <ul className="list-disc ml-4 text-gray-700">
            {property.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>

        {/* Sección de reservas */}
        <div className="border rounded-lg p-6 shadow-lg sticky top-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              ${property.price} <span className="text-sm text-gray-600">COP/noche</span>
            </h3>
          </div>

          {/* Rango de fechas */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Llegada</label>
              <input
                type="date"
                className="w-full border rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Salida</label>
              <input
                type="date"
                className="w-full border rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <button className="w-full mt-4 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300">
            Reservar
          </button>
        </div>
      </div>

      {/* Mapa de ubicación */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Ubicación</h3>
        <iframe
          src={`https://www.google.com/maps?q=${property.location.lat},${property.location.lng}&output=embed`}
          title="Ubicación de la propiedad"
          className="w-full h-96 rounded-lg shadow-md"
        />
        <p className="mt-2 text-gray-600">{property.location.name}</p>
      </div>
    </div>
  );
};

export default PropertyDetails;
