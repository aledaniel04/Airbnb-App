import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MapSection from "../components/MapSection";
import CountersSection from "../components/CountersSection";
import { uploadImages, insertProperty } from "../services/auth";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const FormularioAirbnb = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    spaceType: "",
    accommodationType: "",
    amenities: [],
    photos: null,
    title: "",
    description: "",
    price: "",
    counters: { Huespedes: 0, Habitaciones: 0, Camas: 0, Baños: 0 },
    dateRange: { startDate: null, endDate: null, key: "selection" },
    selectedLocation: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        photos: e.target.files,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const incrementCounter = (field) => {
    setFormData((prev) => ({
      ...prev,
      counters: {
        ...prev.counters,
        [field]: prev.counters[field] + 1,
      },
    }));
  };

  const decrementCounter = (field) => {
    setFormData((prev) => ({
      ...prev,
      counters: {
        ...prev.counters,
        [field]: Math.max(prev.counters[field] - 1, 0),
      },
    }));
  };

  const handleLocationSelection = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
          try {
            const response = await fetch(url);
            const data = await response.json();

            // Extraer el nombre de la ubicación desde la respuesta
            const locationName = data.display_name || "Ubicación desconocida";

            setFormData((prev) => ({
              ...prev,
              selectedLocation: { lat: latitude, lng: longitude, name: locationName },
            }));
          } catch (error) {
            console.error("Error al obtener la ubicación:", error);
          }
        },
        () => {
          console.log("No se pudo obtener la ubicación actual.");
        }
      );
    } else {
      console.log("La geolocalización no es compatible con este navegador.");
    }
  };

  // Función para generar descripción por defecto
  const generateDefaultDescription = () => {
    const defaultDescription =
      "¡Descubre esta increíble propiedad! Perfecta para viajeros, ofrece comodidad, amplitud y una ubicación inmejorable. Ideal para familias, amigos o parejas que buscan una estancia inolvidable.";
    setFormData((prev) => ({ ...prev, description: defaultDescription }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await uploadImages(formData.photos);
      const propertyData = { ...formData, photos: imageUrls, id: user.id };
      await insertProperty(propertyData);

      toast.success("Propiedad subida correctamente.", {
        position: "top-right",
        autoClose: 3000, // Tiempo en ms (3 segundos)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFormData({
        spaceType: "",
        accommodationType: "",
        amenities: [],
        photos: null,
        title: "",
        description: "",
        price: "",
        counters: { Huespedes: 0, Habitaciones: 0, Camas: 0, Baños: 0 },
        dateRange: { startDate: null, endDate: null, key: "selection" },
        selectedLocation: null,
      });
      setTimeout(() => {
        navigate("/propiedades"); // Ruta a tus propiedades
      }, 3500);
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-16 md:mb-0">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Agrega tu propiedad a Airbnb</h1>
        <form onSubmit={handleSubmit}>
          {/* Select Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              ¿Cuál de estas opciones describe mejor tu espacio?
            </label>
            <select
              name="spaceType"
              value={formData.spaceType}
              onChange={handleChange}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Seleccionar</option>
              <option value="Vistas Increíbles">Vistas Increíbles</option>
              <option value="Islas">Islas</option>
              <option value="Mansiones">Mansiones</option>
              <option value="Habitaciones">Habitaciones</option>
              <option value="Piscinas">Piscinas</option>
              <option value="Granjas">Granjas</option>
              <option value="Playas">Playas</option>
              <option value="Barcos">Barcos</option>
              <option value="Cabaña">Cabaña</option>
            </select>
          </div>

          {/* Radio Input */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700">
              ¿De qué tipo de alojamiento dispondrán los huéspedes?
            </p>
            <div className="mt-2 space-y-2">
              {["Un alojamiento entero", "Una habitación", "Una habitación compartida en un hostal"].map((type) => (
                <label className="flex items-center" key={type}>
                  <input
                    type="radio"
                    name="accommodationType"
                    value={type}
                    checked={formData.accommodationType === type}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {type === "Un alojamiento entero"
                    ? "Un alojamiento entero"
                    : type === "Una habitación"
                      ? "Una habitación"
                      : "Una habitación compartida en un hostal"}
                </label>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <MapSection
            selectedLocation={formData.selectedLocation}
            setSelectedLocation={(location) =>
              setFormData((prev) => ({ ...prev, selectedLocation: location }))
            }
            handleLocationSelection={handleLocationSelection}
          />

          {/* Counters */}
          <CountersSection
            counters={formData.counters}
            incrementCounter={incrementCounter}
            decrementCounter={decrementCounter}
          />

          {/* Calendar */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700">
              Agrega las fechas en las que puedes recibir los huéspedes
            </p>
            <div className="mt-2 bg-white rounded-lg shadow-md z-50 p-4">
              <DateRange
                ranges={[formData.dateRange]}
                onChange={(ranges) =>
                  setFormData((prev) => ({ ...prev, dateRange: ranges.selection }))
                }
                months={2}
                direction="horizontal"
                showMonthAndYearPickers={false}
                rangeColors={["#FF385C"]}
                minDate={new Date()}
                className="w-full mx-auto"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700">
              Estas son las comodidades preferidas por los huéspedes. ¿Las tienes?
            </p>
            <div className="mt-2 space-y-2">
              {["Wifi", "TV", "Cocina", "Lavadora"].map((amenity) => (
                <label className="flex items-center" key={amenity}>
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity.toLowerCase()}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Agrega algunas fotos de tu casa
            </label>
            <input
              type="file"
              name="photos"
              accept="image/*"
              onChange={handleChange}
              className="mt-2 block w-full"
            />
          </div>

          {/* Text Inputs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Ahora, ponle un título a tu casa
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Descripción Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Escribe tu descripción
            </label>
            <div className="relative">
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu propiedad aquí..."
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
              <button
                type="button"
                onClick={generateDefaultDescription}
                className="mt-2 bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 transition"
              >
                Generar descripción
              </button>
            </div>
          </div>

          {/* Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Ahora, establece el precio
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg">
            Publicar
          </button>
        </form>
      </div>
      <div>
        <Navbar />
      </div>
    </>
  );
};

export default FormularioAirbnb;
