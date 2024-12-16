import React, { useEffect, useState, useContext } from 'react';
import { addFavorite, getUserFavorites, removeFavorite } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FavoriteProperty = () => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]); 
    const [favoriteIds, setFavoriteIds] = useState(new Set()); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleFavorite = async (propertyId) => {
        if (favoriteIds.has(propertyId)) {
            await removeFavorite(user.id, propertyId);
            setFavoriteIds((prev) => {
                const updated = new Set(prev);
                updated.delete(propertyId);
                return updated;
            });
            setFavorites((prev) => prev.filter((fav) => fav.id !== propertyId)); // Eliminar de favoritos
            toast.success("Se elimino de tu lista favoritos.", {
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
        const propertyUrl = `/infoproperty/${property.slug}`;
        window.open(propertyUrl, '_blank');
    };

    useEffect(() => {
        if (!user) return; // Si no hay usuario, no cargar favoritos
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const { data, error } = await getUserFavorites(user.id);
                if (error) {
                    setError('Error al obtener propiedades favoritas');
                } else {
                    setFavorites(data.map((fav) => fav.propiedades)); // Guardar las propiedades completas
                    setFavoriteIds(new Set(data.map((fav) => fav.property_id))); // Solo los IDs en un Set
                }
            } catch (err) {
                console.error('Error al obtener favoritos:', err);
                setError('Error al cargar las propiedades favoritas.');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchFavorites();
    }, [user]);

    if (!user) {
        return (
            <>
                <div className="container mx-auto p-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Mis Propiedades Favoritas</h2>
                    <p className="text-lg mb-6">Por favor, inicia sesión para ver tus propiedades favoritas.</p>
                    <Link
                        className="bg-[#ff385c] text-white py-2 px-4 rounded hover:bg-pink-600"
                        to={"/auth"} 
                    >
                        Iniciar sesión
                    </Link>
                </div>
                <div>
                    <Navbar />
                </div>
            </>

        );
    }

    if (loading) return <p>Cargando propiedades favoritas...</p>;
    if (error) return <p>{error}</p>;
    return (
        <>
        <ToastContainer />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Mis Propiedades Favoritas</h2>
                {favorites.length === 0 ? (
                    <p>No tienes propiedades favoritas.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 md:mb-0">
                        {favorites.map((property) => (
                            <div
                                onClick={() => openPropertyInNewTab(property)}
                                key={property.id}
                                className="rounded shadow p-2 bg-white relative"
                            >
                                {/* Corazón para favoritos */}
                                <div
                                    className="absolute top-2 right-2 p-2 rounded-full cursor-pointer z-10  shadow"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita que el clic abra la propiedad
                                        toggleFavorite(property.id);
                                    }}
                                >
                                    {favoriteIds.has(property.id) ? (
                                        <Icon icon="mdi:heart" color="red" width="28" height="28" />
                                    ) : (
                                        <Icon icon="mdi:heart-outline" width="28" height="28" />
                                    )}
                                </div>
                                <img
                                    src={property.photos}
                                    alt={property.title}
                                    className="w-full h-48 object-cover rounded"
                                />
                                <h3 className="text-lg font-semibold mt-2">{property.title}</h3>
                                <p>${property.price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <Navbar />
            </div>
        </>
    );
};

export default FavoriteProperty;