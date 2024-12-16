import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { signOut, updateUserProfile } from '../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.new_email || '',
    phone: user?.phone || '',
    password: '', // Esto puede ser usado para gestionar contraseñas si es necesario
  });
  const [loading, setLoading] = useState(false);
  const navegador = useNavigate()


  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = async (field) => {
    setLoading(true);
    const updates = { [field]: formData[field] };

    const result = await updateUserProfile(user?.new_email, updates); // Actualiza con tu lógica
    if (result.error) {
      console.error('Error al actualizar:', result.error);
    } else {
      setUser((prev) => ({ ...prev, ...updates }));
    }
    setEditingField(null);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const cerraSesion = () => {
    navegador('/')
    signOut()
  }

  return (
    <>
    <div className="p-6 max-w-2xl mx-auto">
      <div className='flex items-center gap-4'>
        <h1 className="text-2xl font-bold mb-1">Información personal</h1>
      </div>
      {/* Nombre */}
      <div className="flex justify-between items-center border-b py-4">
        <div>
          <p className="text-gray-600">Nombre legal</p>
          {editingField === 'name' ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border p-2 w-full"
            />
          ) : (
            <p>{user?.name || 'No proporcionado'}</p>
          )}
        </div>
        {editingField === 'name' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSave('name')}
              className="text-blue-500 font-semibold"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="text-gray-500 font-semibold"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEdit('name')}
            className="text-blue-500 font-semibold"
          >
            Editar
          </button>
        )}
      </div>

      {/* Correo Electrónico */}
      <div className="flex justify-between items-center border-b py-4">
        <div>
          <p className="text-gray-600">Dirección de correo electrónico</p>
          {editingField === 'email' ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="border p-2 w-full"
            />
          ) : (
            <p>{user?.email || 'No proporcionado'}</p>
          )}
        </div>
        {editingField === 'email' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSave('email')}
              className="text-blue-500 font-semibold"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="text-gray-500 font-semibold"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEdit('email')}
            className="text-blue-500 font-semibold"
          >
            Editar
          </button>
        )}
      </div>

      {/* Número de Teléfono */}
      <div className="flex justify-between items-center border-b py-4">
        <div>
          <p className="text-gray-600">Número de teléfono</p>
          {editingField === 'phone' ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="border p-2 w-full"
            />
          ) : (
            <p>{user?.phone || 'No proporcionado'}</p>
          )}
        </div>
        {editingField === 'phone' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSave('phone')}
              className="text-blue-500 font-semibold"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="text-gray-500 font-semibold"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEdit('phone')}
            className="text-blue-500 font-semibold"
          >
            Agregar
          </button>
        )}
      </div>

      {/* Botón Salir */}
      <div className="mt-6">
        <button
          onClick={cerraSesion}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
    <Navbar/>
    </>
  );
};

export default UserProfile;
