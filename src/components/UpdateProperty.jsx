import MapSection from "./MapSection";
import CountersSection from "./CountersSection";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const UpdateProperty = ({
    handleUpdateSubmit,
    selectedProperty,
    formData,
    handleInputChange,
    setSelectedProperty,
    incrementCounter,
    decrementCounter,
    setFormData,
}) => {
    const handleLocationSelection = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
    
                    // Realizar solicitud de geocodificación a Nominatim
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
    
                        // Extraer el nombre de la ubicación desde la respuesta
                        const locationName = data.display_name || "Ubicación desconocida";
    
                        setFormData((prev) => ({
                            ...prev,
                            location: { lat: latitude, lng: longitude, name: locationName },
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
    

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                photos: files, // Actualizamos con el archivo seleccionado
                previewImage: URL.createObjectURL(files[0]), // Vista previa de la imagen
            }));
        }
    };
    

    const handleDateChange = (ranges) => {
        setFormData((prev) => ({
            ...prev,
            dateRange: ranges.selection,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg md:w-3/4 max-w-4xl overflow-y-scroll h-screen">
                <h2 className="text-xl font-bold mb-4">
                    Actualizar Propiedad: {selectedProperty.title}
                </h2>
                <form onSubmit={handleUpdateSubmit}>
                    {/* Título */}
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Título
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Imagen */}
                    <div className="mb-6">
                        <label
                            htmlFor="photos"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Imagen Actual
                        </label>
                        {formData.previewImage || (formData.photos && formData.photos[0]) ? (
                            <img
                                src={
                                    formData.previewImage ||
                                    formData.photos[0] // Muestra la vista previa o la imagen actual
                                }
                                alt="Imagen de la propiedad"
                                className="w-full h-60 object-cover rounded-md mb-4"
                            />
                        ) : (
                            <p className="text-sm text-gray-500">No hay imagen disponible.</p>
                        )}
                        <label
                            htmlFor="updatePhotos"
                            className="block text-sm font-medium text-gray-700 mt-4"
                        >
                            Actualizar Imagen
                        </label>
                        <input
                            type="file"
                            id="updatePhotos"
                            name="photos"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-2 block w-full"
                        />
                    </div>


                    {/* Fecha */}
                    <div className="mb-6">
                        <div
                            className="block text-sm font-medium text-gray-700"
                        >
                            Rango de Fechas
                        </div>
                        <DateRange
                            ranges={[formData.dateRange]} // Usa directamente formData.dateRange
                            onChange={handleDateChange}
                            months={2}
                            direction="horizontal"
                            showMonthAndYearPickers={false}
                            rangeColors={["#FF385C"]}
                            minDate={new Date()}
                            className="w-full mx-auto mt-2"
                        />
                    </div>


                    {/* Descripción */}
                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                        ></textarea>
                    </div>

                    {/* Precio */}
                    <div className="mb-4">
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Precio
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Tipo de espacio */}
                    <div className="mb-4">
                        <label
                            htmlFor="spaceType"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tipo de Espacio
                        </label>
                        <select
                            id="spaceType"
                            name="space_type" // Asegurarse de usar el nombre correcto
                            value={formData.space_type || ""}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    space_type: e.target.value, // Actualiza correctamente el espacio seleccionado
                                }));
                            }}
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


                    {/* Tipo de alojamiento */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700">
                            ¿De qué tipo de alojamiento dispondrán los huéspedes?
                        </p>
                        <div className="mt-2 space-y-2">
                            {["Un alojamiento entero", "Una habitación", "Una habitación compartida en un hostal"].map((type) => (
                                <label className="flex items-center" key={type}>
                                    <input
                                        type="radio"
                                        name="accommodation_type" // Usar el nombre correcto
                                        value={type}
                                        checked={formData.accommodation_type === type}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                accommodation_type: e.target.value, // Actualiza el tipo seleccionado
                                            }));
                                        }}
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

                    {/* Comodidades */}
                    <div className="mb-4">
                        <div className="block text-sm font-medium text-gray-700">
                            Comodidades
                        </div>
                        {["Wifi", "TV", "Cocina", "Lavadora"].map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="amenities"
                                    value={amenity}
                                    checked={formData.amenities.includes(amenity.toLowerCase())} // Convertir a minúsculas
                                    onChange={(e) => {
                                        const { checked, value } = e.target;
                                        setFormData((prev) => ({
                                            ...prev,
                                            amenities: checked
                                                ? [...prev.amenities, value.toLowerCase()] // Guardar en minúsculas
                                                : prev.amenities.filter((item) => item !== value.toLowerCase()),
                                        }));
                                    }}
                                />
                                <span>{amenity}</span>
                            </label>
                        ))}
                    </div>
                    {/* Mapa */}
                    <MapSection
                        selectedLocation={formData.location} // Cambiado a `location`
                        setSelectedLocation={(location) =>
                            setFormData((prev) => ({ ...prev, location })) // Cambiado a `location`
                        }
                        handleLocationSelection={handleLocationSelection}
                    />

                    <CountersSection
                        counters={formData.counters}
                        incrementCounter={incrementCounter}
                        decrementCounter={decrementCounter}
                    />

                    {/* Botones */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setSelectedProperty(null)}
                            className="px-4 py-2 bg-gray-300 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default UpdateProperty;
