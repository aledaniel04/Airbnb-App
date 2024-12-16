// src/services/auth.js
import slugify from 'slugify';
import { supabase } from './supabase';


// Registrar un nuevo usuario
export const registerUser = async (email, password, fullName, phone) => {
  try {
    // Registro inicial del usuario en Supabase con email y contraseña
    const { data, error } = await supabase.auth.signUp(
      {
        phone,
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          shouldCreateUserSession: false, // Evita la creación automática de sesión
        },
      }
    );

    if (error) throw error;

    // Cierre de sesión por seguridad
    await supabase.auth.signOut();

    return data; // Devuelve los datos del registro (sin sesión activa)
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { error };
  }
};


// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data; // Devuelve la información de la sesión
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { error };
  }
};

// Cerrar sesión
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

// Iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return { error };
  }
};

// Iniciar sesión con Facebook
export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error al iniciar sesión con Facebook:', error);
    return { error };
  }
};

// Verificar si el número de teléfono ya está registrado usando OTP
export const sendOtp = async (phone) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { error };
  }
};

//enviar codigo para completar la verificacion
export const verifyOtp = async (phone, otpCode) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otpCode,
      type: 'sms',
    });

    if (error) throw error;

    // Retorna un objeto estructurado en caso de éxito
    return { data, error: null };
  } catch (error) {
    console.error('Error al verificar OTP:', error);
    return { error };
  }
};

// Función para actualizar el correo electrónico y metadatos del usuario
export const updateUserProfile = async (newEmail, metadataUpdates) => {
  try {
    // Actualizar el correo electrónico del usuario
    const { data: updatedUser, error: emailError } = await supabase.auth.updateUser({
      email: newEmail, // Nuevo correo electrónico
      data: metadataUpdates, // Metadatos adicionales que quieras actualizar
    });

    if (emailError) {
      throw emailError; // Manejar error al actualizar el correo
    }

    console.log("Perfil actualizado correctamente:", updatedUser);
    return { data: updatedUser };
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return { error };
  }
};

// Subir imágenes al bucket de Supabase
export const uploadImages = async (files) => {
  try {
    const uploadedUrls = [];

    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('propiedades') // Nombre del bucket
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('propiedades')
        .getPublicUrl(fileName);

      if (publicUrl) uploadedUrls.push(publicUrl.publicUrl);
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    return [];
  }
};

// Insertar una propiedad en la tabla `propiedades`
export const insertProperty = async (propertyData) => {
  try {
    const slug = slugify(`${propertyData.title}-${Date.now()}`, {
      lower: true,
      strict: true,
    });

    const { data, error } = await supabase.from('propiedades').insert({
      user_id: propertyData.id,
      space_type: propertyData.spaceType,
      accommodation_type: propertyData.accommodationType,
      amenities: propertyData.amenities,
      photos: propertyData.photos,
      title: propertyData.title,
      description: propertyData.description,
      price: propertyData.price,
      guest_count: propertyData.counters.Huespedes,
      room_count: propertyData.counters.Habitaciones,
      bed_count: propertyData.counters.Camas,
      bathroom_count: propertyData.counters.Baños,
      start_date: propertyData.dateRange.startDate,
      end_date: propertyData.dateRange.endDate,
      location: propertyData.selectedLocation,
      slug, // Guarda el slug en la base de datos
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error al insertar la propiedad:', error);
    return { error };
  }
};

//mostrar las propiedades en el inicio
export const showProperties = async (
  category = null,
  { location, startDate, endDate, guestCount } = {}
) => {
  try {
    let query = supabase.from('propiedades').select('*');

    // Filtrar por ubicación (extraer solo el país)
    if (location) {
      query = query.ilike('location->>name', `%${location}`);
    }

    // Filtrar por fechas (asegúrate de que startDate y endDate estén en formato ISO)
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString().split('T')[0];
      const end = new Date(endDate).toISOString().split('T')[0];
      query = query.or(`start_date.lte.${end},end_date.gte.${start}`);
    }

    // Filtrar por cantidad de huéspedes
    if (guestCount) {
      query = query.gte('guest_count', guestCount);
    }

    // Filtrar por categoría
    if (category) {
      query = query.eq('space_type', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    return { data: null, error };
  }
};

// Obtener las propiedades del usuario autenticado
export const getUserProperties = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("propiedades")
      .select("*") // Selecciona todos los campos de la tabla
      .eq("user_id", userId); // Filtra las propiedades por el user_id

    if (error) {
      throw error;
    }

    return data; // Retorna las propiedades del usuario
  } catch (error) {
    console.error("Error al obtener las propiedades del usuario:", error);
    throw error;
  }
};

//mostrar una propiedad en especifico
export const getPropertyBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error al obtener la propiedad:', error);
    return null;
  }
};

/// Subir una imagen al bucket de Supabase
const uploadImage = async (file) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("propiedades")
      .upload(fileName, file);

    if (error) throw new Error(`Error al subir la imagen: ${error.message}`);

    // Obtener la URL pública del archivo subido
    const { data: urlData, error: urlError } = supabase.storage
      .from("propiedades")
      .getPublicUrl(fileName);

    if (urlError) throw new Error(`Error al obtener la URL pública: ${urlError.message}`);

    if (!urlData.publicUrl) {
      throw new Error(`No se pudo obtener la URL pública para el archivo: ${fileName}`);
    }

    return urlData.publicUrl; // Retornar solo la URL pública como texto plano
  } catch (error) {
    console.error("Error al subir la imagen:", error.message);
    throw error;
  }
};

//actualizar propiedades
export const updateProperty = async (id, updatedData) => {
  try {
    let updatedPhotos = Array.isArray(updatedData.photos)
      ? updatedData.photos
      : [];

    // Subir imágenes si `photos` es un `FileList`
    if (updatedData.photos instanceof FileList) {
      updatedPhotos = [];
      for (const file of updatedData.photos) {
        try {
          const uploadedUrl = await uploadImage(file); // Llamada a `uploadImage`
          updatedPhotos.push(uploadedUrl);
        } catch (uploadError) {
          console.error("Error subiendo una imagen:", uploadError.message);
          throw new Error("Error subiendo las imágenes. Por favor, intenta nuevamente.");
        }
      }
    }

    const slug = slugify(`${updatedData.title}-${Date.now()}`, {
      lower: true,
      strict: true,
    });

    console.log("Datos a actualizar en Supabase:", {
      ...updatedData,
      photos: updatedPhotos,
    });

    // Actualizar en la base de datos
    const { data, error } = await supabase
      .from("propiedades")
      .update({
        space_type: updatedData.space_type,
        accommodation_type: updatedData.accommodation_type,
        amenities: updatedData.amenities,
        photos: updatedPhotos, // Guardar solo las URLs como texto plano
        title: updatedData.title,
        description: updatedData.description,
        price: updatedData.price,
        guest_count: updatedData.counters.Huespedes,
        room_count: updatedData.counters.Habitaciones,
        bed_count: updatedData.counters.Camas,
        bathroom_count: updatedData.counters.Baños,
        start_date: updatedData.dateRange?.startDate || null,
        end_date: updatedData.dateRange?.endDate || null,
        location: updatedData.location,
        slug, // Actualizar el slug
      })
      .eq("id", id)
      .select("*"); // Retorna los datos actualizados

    if (error) throw new Error(`Error al actualizar la propiedad: ${error.message}`);

    console.log("Datos actualizados devueltos por Supabase:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar la propiedad:", error.message);
    throw error;
  }
};

// Función para eliminar una propiedad de la base de datos
export const deleteProperty = async (id) => {
  try {
    const { data, error } = await supabase
      .from("propiedades")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Error al eliminar la propiedad: ${error.message}`);

    return data;
  } catch (error) {
    console.error("Error al eliminar la propiedad:", error.message);
    throw error;
  }
};

// Agregar una propiedad a favoritos
export const addFavorite = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from('favorito')
    .insert([{ user_id: userId, property_id: propertyId }]);

  if (error) {
    console.error('Error al agregar favorito:', error);
    return { error };
  }
  return { data };
};

// Eliminar una propiedad de favoritos
export const removeFavorite = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from('favorito')
    .delete()
    .match({ user_id: userId, property_id: propertyId });

  if (error) {
    console.error('Error al eliminar favorito:', error);
    return { error };
  }
  return { data };
};

// Obtener todas las propiedades favoritas de un usuario
export const getUserFavorites = async (userId) => {
  const { data, error } = await supabase
    .from('favorito')
    .select('property_id, propiedades (*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error al obtener favoritos:', error);
    return { error };
  }
  return { data };
};