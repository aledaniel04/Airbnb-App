import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Estilo principal
import "react-date-range/dist/theme/default.css"; // Tema por defecto
import { Icon } from "@iconify/react/dist/iconify.js";

const AirbnbSearchBarMovil = ({ onSearch }) => {
    const [activeDropdown, setActiveDropdown] = useState(null); // Controla el dropdown abierto
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: null,
        key: "selection",
    });
    const [guests, setGuests] = useState({
        adults: 0,
        children: 0,
        babies: 0,
        pets: 0,
    });
    const [location, setLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const suggestionRef = useRef(null); // Referencia para la lista de sugerencias

    const dropdownRef = useRef(null);

    // Autocompletar ubicación utilizando Nominatim
    const fetchLocationSuggestions = async (query) => {
        if (!query) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5,
                },
            });
            const suggestions = response.data.map((item) => item.display_name);
            setLocationSuggestions(suggestions);
        } catch (error) {
            console.error('Error al obtener sugerencias de ubicación:', error);
        }
    };

    // Lógica para cerrar dropdowns al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
            if (
                suggestionRef.current &&
                !suggestionRef.current.contains(event.target)
            ) {
                setLocationSuggestions([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (section) => {
        setActiveDropdown(activeDropdown === section ? null : section);
    };

    const updateGuestCount = (type, operation) => {
        setGuests((prev) => {
            const newCount =
                operation === "increment"
                    ? prev[type] + 1
                    : Math.max(prev[type] - 1, 0);

            if (
                (type === "children" || type === "babies" || type === "pets") &&
                newCount > 0
            ) {
                return {
                    ...prev,
                    adults: Math.max(prev.adults, 1), // Asegura que haya al menos un adulto
                    [type]: newCount,
                };
            }

            return {
                ...prev,
                [type]: newCount,
            };
        });
    };

    const generateGuestText = () => {
        const { adults, children, babies, pets } = guests;

        const parts = [];
        if (adults > 0) parts.push(`${adults} adulto${adults > 1 ? "s" : ""}`);
        if (children > 0) parts.push(`${children} niño${children > 1 ? "s" : ""}`);
        if (babies > 0) parts.push(`${babies} bebé${babies > 1 ? "s" : ""}`);
        if (pets > 0) parts.push(`${pets} mascota${pets > 1 ? "s" : ""}`);

        return parts.length > 0 ? parts.join(", ") : "Añade huéspedes";
    };

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleSearch = () => {
        const totalGuests = guests.adults + guests.children + guests.babies;
        onSearch({
            location,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            guestCount: totalGuests,
        });
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full bg-white border border-gray-300 rounded-full shadow-sm p-4 flex items-center justify-between max-w-md">
                <button
                    className="text-left flex-1"
                    onClick={() => toggleDropdown("location")}
                >
                    {
                        location ? <p>{location}</p> : <p className="text-sm font-medium">¿A dónde quieres ir?</p>
                    }
                </button>
                <button
                    className="text-left flex-1"
                    onClick={() => toggleDropdown("dates")}
                >
                    <p className="text-sm font-medium">
                        {dateRange.startDate && dateRange.endDate
                            ? `${formatDate(dateRange.startDate)} - ${formatDate(
                                dateRange.endDate
                            )}`
                            : "¿Cuándo?"}
                    </p>
                </button>
                <button
                    className="text-left flex-1"
                    onClick={() => toggleDropdown("guests")}
                >
                    <p className="text-sm font-medium">{generateGuestText()}</p>
                </button>
                <button onClick={handleSearch} className="text-gray-500">
                    <Icon icon="material-symbols:search" width="24" height="24" />
                </button>
            </div>

            {/* Dropdown para ubicación */}
            {activeDropdown === "location" && (
                <div
                ref={dropdownRef}
                    className="absolute top-20 bg-white w-[90%] rounded-2xl p-4 shadow-lg z-50 border-2"
                >
                    <div className="flex items-center mb-4">
                        <p className="text-sm font-medium ml-2">¿A dónde quieres ir?</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Explora destinos"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            fetchLocationSuggestions(e.target.value);
                        }}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                    {locationSuggestions.length > 0 && (
                        <ul ref={suggestionRef} className="absolute z-50 bg-white border border-gray-300 w-full rounded-md mt-1">
                            {locationSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        const country = suggestion.split(',').pop().trim(); // Toma solo el país
                                        setLocation(country); // Actualiza el input con el país seleccionado
                                        setLocationSuggestions([]); // Cierra la lista de sugerencias
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Dropdown para seleccionar fechas */}
            {activeDropdown === "dates" && (
                <div
                    ref={dropdownRef}
                    className="absolute top-20 bg-white w-[95%] rounded-2xl shadow-lg z-50 border-2"
                >
                    <div className="flex items-center">
                        <p className="text-sm font-medium p-4">¿Cuándo es tu viaje?</p>
                    </div>
                    <div className="flex justify-start">
                        <DateRange
                            ranges={[dateRange]}
                            onChange={(ranges) => setDateRange(ranges.selection)}
                            months={1}
                            direction="vertical"
                            minDate={new Date()} // Restringir a fechas desde hoy
                            rangeColors={["#FF385C"]} // Color del rango
                            className="w-full"
                        />
                    </div>
                </div>
            )}

            {/* Dropdown para seleccionar huéspedes */}
            {activeDropdown === "guests" && (
                <div
                    ref={dropdownRef}
                    className="absolute top-20 bg-white w-[90%] rounded-2xl p-4 shadow-lg z-50 border-2"
                >
                    <div className="flex items-center mb-4">
                        <p className="text-sm font-medium ml-2">¿Quines te acompañan?</p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        {["adults", "children", "babies", "pets"].map((type) => (
                            <div className="flex justify-between items-center" key={type}>
                                <p className="capitalize">
                                    {type === "adults"
                                        ? "Adultos"
                                        : type === "children"
                                            ? "Niños"
                                            : type === "babies"
                                                ? "Bebés"
                                                : "Mascotas"}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="px-2 py-1 bg-gray-200"
                                        onClick={() => updateGuestCount(type, "decrement")}
                                    >
                                        -
                                    </button>
                                    <span>{guests[type]}</span>
                                    <button
                                        className="px-2 py-1 bg-gray-200"
                                        onClick={() => updateGuestCount(type, "increment")}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirbnbSearchBarMovil;
