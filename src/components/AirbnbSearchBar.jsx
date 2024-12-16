import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Estilo principal
import 'react-date-range/dist/theme/default.css'; // Tema por defecto

const AirbnbSearchBar = ({ onSearch }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: 'selection',
  });
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: 0,
  });
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const calendarRef = useRef(null);
  const guestDropdownRef = useRef(null);
  const suggestionRef = useRef(null); // Referencia para la lista de sugerencias

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

  // Lógica para cerrar los dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target)
      ) {
        setIsGuestDropdownOpen(false);
      }
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        !event.target.classList.contains('location-input')
      ) {
        setLocationSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);
  const toggleGuestDropdown = () => setIsGuestDropdownOpen(!isGuestDropdownOpen);

  const updateGuestCount = (type, operation) => {
    setGuests((prev) => {
      const newCount = operation === 'increment' ? prev[type] + 1 : Math.max(prev[type] - 1, 0);

      // Si se agrega un niño, bebé o mascota, aseguramos que haya al menos 1 adulto
      if ((type === 'children' || type === 'babies' || type === 'pets') && newCount > 0) {
        return {
          ...prev,
          adults: Math.max(prev.adults, 1),
          [type]: newCount,
        };
      }

      return {
        ...prev,
        [type]: newCount,
      };
    });
  };

  // Generar el texto del input "Quién"
  const generateGuestText = () => {
    const { adults, children, babies, pets } = guests;

    const parts = [];
    if (adults > 0) parts.push(`${adults} adulto${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} niño${children > 1 ? 's' : ''}`);
    if (babies > 0) parts.push(`${babies} bebé${babies > 1 ? 's' : ''}`);
    if (pets > 0) parts.push(`${pets} mascota${pets > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '';
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
    <div className="relative bg-white border border-gray-300 rounded-full shadow-lg p-2 flex flex-col md:flex-row md:items-center md:justify-between w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:divide-x divide-gray-300 w-full">
        {/* Dónde */}
        <div className="p-2 flex-1 cursor-pointer">
          <label className="text-xs text-gray-500">Dónde</label>
          <input
            type="text"
            placeholder="Explora destinos"
            className="w-full bg-transparent outline-none text-sm"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              fetchLocationSuggestions(e.target.value);
            }}
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
        {/* Llegada */}
        <div className="p-2 flex-1 relative" onClick={toggleCalendar}>
          <label className="text-xs text-gray-500">Llegada</label>
          <input
            type="text"
            placeholder="Agrega fecha"
            className="w-full bg-transparent outline-none text-sm cursor-pointer"
            readOnly
            value={
              dateRange.startDate
                ? dateRange.startDate.toLocaleDateString()
                : '' // Si no hay fecha seleccionada, mostramos el placeholder
            }
          />
        </div>
        {/* Salida */}
        <div className="p-2 flex-1 relative" onClick={toggleCalendar}>
          <label className="text-xs text-gray-500">Salida</label>
          <input
            type="text"
            placeholder="Agrega fecha"
            className="w-full bg-transparent outline-none text-sm cursor-pointer"
            readOnly
            value={
              dateRange.endDate
                ? dateRange.endDate.toLocaleDateString()
                : '' // Si no hay fecha seleccionada, mostramos el placeholder
            }
          />
        </div>
        {/* Quién */}
        <div className="p-2 flex-1 relative" onClick={toggleGuestDropdown}>
          <label className="text-xs text-gray-500">Quién</label>
          <input
            type="text"
            placeholder="¿Cuántos?"
            className="w-full bg-transparent outline-none text-sm cursor-pointer"
            readOnly
            value={generateGuestText()}
          />
          {isGuestDropdownOpen && (
            <div
              ref={guestDropdownRef}
              className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-md z-50 p-4 w-64"
              onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del dropdown cierre el mismo
            >
              {['adults', 'children', 'babies', 'pets'].map((type) => (
                <div
                  key={type}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {type === 'adults'
                        ? 'Adultos'
                        : type === 'children'
                          ? 'Niños'
                          : type === 'babies'
                            ? 'Bebés'
                            : 'Mascotas'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {type === 'adults'
                        ? 'Edad: 13 años o más'
                        : type === 'children'
                          ? 'Edades 2 – 12'
                          : type === 'babies'
                            ? 'Menos de 2 años'
                            : '¿Traes a un animal de servicio?'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 bg-gray-200 rounded-full"
                      onClick={() => updateGuestCount(type, 'decrement')}
                    >
                      -
                    </button>
                    <span className="text-sm">{guests[type]}</span>
                    <button
                      className="p-1 bg-gray-200 rounded-full"
                      onClick={() => updateGuestCount(type, 'increment')}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Botón de búsqueda */}
      <div className="flex items-center justify-center mt-4 md:mt-0 md:ml-4">
        <button onClick={handleSearch} className="bg-pink-500 text-white rounded-full p-3 hover:bg-pink-600">
          Buscar
        </button>
      </div>

      {/* Calendario */}
      {isCalendarOpen && (
        <div
          ref={calendarRef} // Referencia para detectar clics fuera
          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-md z-50 p-4"
        >
          <DateRange
            ranges={[dateRange]}
            onChange={(ranges) => setDateRange(ranges.selection)}
            months={2}
            direction="horizontal"
            showMonthAndYearPickers={false}
            rangeColors={['#FF385C']}
            minDate={new Date()} // Limita las fechas a partir de hoy
          />
        </div>
      )}
    </div>
  );
};

export default AirbnbSearchBar;
