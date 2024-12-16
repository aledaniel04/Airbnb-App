import React, { useContext, useEffect, useState } from 'react'
import { addFavorite, removeFavorite, getUserFavorites, showProperties } from '../services/auth';
import { Icon } from '@iconify/react/dist/iconify.js'
import { AuthContext } from '../context/AuthContext';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowProperties = ({ selectedCategory, filters }) => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState(new Set());
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
        const { data, error } = await getUserFavorites(user.id); // user.id debe estar disponible
        if (!error) {
            setFavorites(new Set(data.map((fav) => fav.property_id)));
        }
    };

    const toggleFavorite = async (propertyId) => {
        if (favorites.has(propertyId)) {
            await removeFavorite(user.id, propertyId);
            setFavorites((prev) => {
                const updated = new Set(prev);
                updated.delete(propertyId);
                return updated;
            });
            toast.success("Se elimino de tu lista favoritos.", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            await addFavorite(user.id, propertyId);
            setFavorites((prev) => new Set(prev).add(propertyId));
            toast.success("Se agrego a tu lista favoritos.", {
                position: "bottom-left",
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

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true); // Mostrar cargando al cambiar de categoría
            try {
                const { location, startDate, endDate, guestCount } = filters || {};
                const { data, error } = await showProperties(selectedCategory, { location, startDate, endDate, guestCount });

                if (error) {
                    setError(error.message);
                } else {
                    setProperties(data || []);
                    // Solo cargar favoritos si el usuario está autenticado
                    if (user && user.id) {
                        await fetchFavorites();
                    }
                }
            } catch (error) {
                console.error('Error al cargar las propiedades:', error);
                setError('Ocurrió un error al cargar las propiedades.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [selectedCategory, filters, user]);

    if (loading) return <p>Cargando propiedades...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <ToastContainer />
            {properties.length === 0 ? (
                <p>No tienes propiedades registradas.</p>
            ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-24 mt-4 md:mb-0">
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className='group relative'
                            onClick={() => openPropertyInNewTab(property)}
                        >
                            {
                                user && (
                                    <div className="absolute top-2 right-2 p-2 rounded-full cursor-pointer z-10"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evita que el clic abra la propiedad
                                            toggleFavorite(property.id);
                                        }}>
                                        {favorites.has(property.id) ? (
                                            <Icon icon="mdi:heart" color="red" width="28" height="28" />
                                        ) : (
                                            <Icon icon="mdi:heart-outline" color='white' width="28" height="28" />
                                        )}
                                    </div>
                                )
                            }
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-xl bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-64">
                                <img
                                    src={property.photos} 
                                    alt={property.title}
                                    className="h-72 w-full object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className=" flex justify-between">
                                <div>
                                    <h3 className="text-lg text-black">
                                        <p className='flex flex-col'>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            <strong>{property.title}{filters ? <span>, {filters.location}</span> : ""}</strong>
                                        </p>
                                    </h3>
                                    <p className='font-medium text-[#6a6a6a] text-base'>{property.accommodation_type}</p>
                                    <span className='font-bold text-base'>${parseInt(property.price).toLocaleString('en-US')} COP </span> <span>noche</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}</>
    )
}

export default ShowProperties