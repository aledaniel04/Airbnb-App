import { createContext, useState, useEffect } from 'react';
import {
  signInWithGoogle,
  signInWithFacebook,
  signOut,
  verifyOtp,
  sendOtp,
} from '../services/auth';
import { supabase } from '../services/supabase';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleAuthStateChange = (event, session) => {
    if (session) {
      const { user } = session;
      const userData = {
        id: user.id,
        email: user.user_metadata?.email,
        phone: user.phone,
        name: user.user_metadata?.full_name || 'Usuario',
        avatar: session.user.user_metadata.avatar_url,
        metadata: user.user_metadata,
      };
      setUser(userData);
      console.log('Usuario autenticado:', userData);
    } else {
      setUser(null);
      console.log('Usuario no autenticado.');
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const sendOtpToPhone = async (phone) => {
    const result = await sendOtp(phone);
    return result;
  };

  const verifyOtpCode = async (phone, otpCode) => {
    try {
      const result = await verifyOtp(phone, otpCode);
  
      if (!result.error) {
        const { user } = result.data; // Asegúrate de acceder correctamente al usuario
        const userData = {
          id: user.id,
          email: user.email || null, // Manejar email nulo o undefined
          phone: user.phone,
          name: user.user_metadata?.full_name || null, // Manejar nombre nulo o undefined
          metadata: user.user_metadata,
        };
  
        setUser(userData); // Actualizar el contexto global
        return { user: userData }; // Devuelve el usuario para su uso en el componente
      }
  
      return { error: result.error };
    } catch (error) {
      console.error('Error al verificar OTP:', error);
      return { error };
    }
  };
  

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginWithGoogle: signInWithGoogle,
        loginWithFacebook: signInWithFacebook,
        logout: signOut,
        sendOtpToPhone, // Agregado: Enviar OTP
        verifyOtpCode, // Agregado: Verificar OTP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
