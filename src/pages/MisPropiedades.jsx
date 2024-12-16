import React, { useEffect, useState, useContext } from "react";
import { deleteProperty, getUserProperties, updateProperty } from "../services/auth"; // Función para actualizar propiedad
import { AuthContext } from "../context/AuthContext";
import UpdateProperty from "../components/UpdateProperty";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MisPropiedades = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null); // Propiedad seleccionada para actualizar
  const [selectedPropertyToDelete, setSelectedPropertyToDelete] = useState(null); // Propiedad seleccionada para eliminar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    space_type: "",
    accommodation_type: "",
    amenities: [],
    photos: [],
    title: "",
    description: "",
    price: "",
    counters: {
      Huespedes: 0,
      Habitaciones: 0,
      Camas: 0,
      Baños: 0,
    },
    location: {
      lat: null,
      lng: null,
      name: "",
    },
    dateRange: { startDate: null, endDate: null, key: "selection" },
  });
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const userProperties = await getUserProperties(user.id);
        setProperties(Array.isArray(userProperties) ? userProperties : []);
      } catch (err) {
        console.error("Error al obtener las propiedades:", err);
        setError("No se pudieron cargar las propiedades.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, properties]);

  const handleUpdateClick = (property) => {
    setSelectedProperty(property);
    const counters = {
      Huespedes: property.guest_count || 0,
      Habitaciones: property.room_count || 0,
      Camas: property.bed_count || 0,
      Baños: property.bathroom_count || 0,
    };
    // Asegúrate de inicializar correctamente el rango de fechas
    const dateRange = {
      startDate: property.start_date ? new Date(property.start_date) : new Date(),
      endDate: property.end_date ? new Date(property.end_date) : new Date(),
      key: "selection",
    };

    setFormData({
      ...property,
      counters,
      dateRange, // Agregar dateRange correctamente
      photos: Array.isArray(property.photos) ? property.photos : [], // Asegúrate de que sea un array
    });
  };

  const handleDeleteClick = (property) => {
    setSelectedPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProperty = async () => {
    try {
      await deleteProperty(selectedPropertyToDelete.id);
      setProperties((prev) =>
        prev.filter((property) => property.id !== selectedPropertyToDelete.id)
      );
      toast.success("Propiedad eliminada correctamente.", {
        position: "top-right",
        autoClose: 3000, 
        hideProgressBar: true, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
      toast.error("Hubo un error al eliminar la propiedad." + error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const incrementCounter = (field) => {
    setFormData((prev) => ({
      ...prev,
      counters: {
        ...prev.counters,
        [field]: (prev.counters[field] || 0) + 1, // Asegúrate de manejar valores iniciales undefined
      },
    }));
  };

  const decrementCounter = (field) => {
    setFormData((prev) => ({
      ...prev,
      counters: {
        ...prev.counters,
        [field]: Math.max((prev.counters[field] || 0) - 1, 0),
      },
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProperty = await updateProperty(selectedProperty.id, formData);
      setProperties((prev) =>
        prev.map((property) =>
          property.id === selectedProperty.id ? updatedProperty : property
        )
      );
      toast.success("Propiedad actualizada correctamente.", {
        position: "top-right",
        autoClose: 3000, // Tiempo en ms (3 segundos)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        setSelectedProperty(null);
      }, 3500);
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error);
      toast.error("Hubo un error al eliminar la propiedad." + error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const openPropertyInNewTab = (property) => {
    const propertyUrl = `/infoproperty/${property.slug}`; // Ruta con el slug de la propiedad
    window.open(propertyUrl, '_blank'); // Abre la URL en una nueva pestaña
}

  if (!user) {
    return <p>Inicia sesión para ver tus propiedades.</p>;
  }

  if (loading) {
    return <p>Cargando tus propiedades...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <ToastContainer />
        <h1 className=" text-2xl font-bold text-gray-800 mb-6">Mis Propiedades</h1>
        <div className="flex gap-4">
        <Link to={'/form'} className=" mt-2 px-4 py-2 bg-[#fc642d] text-white rounded-md" >
          Agrega una propiedad
        </Link>
        <Link to={'/'} className=" hidden md:flex mt-2 px-4 py-2 bg-[#00a699] text-white rounded-md" >
          Ir al inicio
        </Link>
        </div>
        {Array.isArray(properties) && properties.length === 0 ? (
          <p>No tienes propiedades registradas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mb-16 md:mb-0">
            {Array.isArray(properties) &&
              properties.filter((property) => property).map((property) => (
                <div
                  key={property.id}
                  className="bg-gray-100 rounded-lg shadow-md p-4"
                  onClick={() => openPropertyInNewTab(property)}
                >
                  <img
                    src={
                      property?.photos && Array.isArray(property.photos) && property.photos.length > 0
                        ? property.photos[0]
                        : "default-placeholder.jpg"
                    }
                    alt={property?.title || "Propiedad sin título"}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />

                  <h2 className="text-lg font-bold mb-2">{property?.title || "Título no disponible"}</h2>
                  <div className="flex justify-between">
                    <button
                      onClick={(e) =>{e.stopPropagation(); handleUpdateClick(property)}}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={(e) => {e.stopPropagation(); handleDeleteClick(property)}}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Modal de actualización */}
        {selectedProperty && (
          <UpdateProperty
            handleUpdateSubmit={handleUpdateSubmit}
            selectedProperty={selectedProperty}
            formData={formData}
            handleInputChange={handleInputChange}
            incrementCounter={incrementCounter}
            decrementCounter={decrementCounter}
            setSelectedProperty={setSelectedProperty}
            setFormData={setFormData} // Agregar setFormData como prop
          />

        )}
        {/* Modal de confirmación para eliminar */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h2 className="text-xl font-semibold mb-4 text-center">¿Estás seguro de eliminar la propiedad{" "}
              <strong>{selectedPropertyToDelete.title}</strong>?</h2>
              <div className="flex justify-evenly space-x-4 mt-8">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProperty}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <Navbar />
      </div>
    </>
  );
};

export default MisPropiedades;
