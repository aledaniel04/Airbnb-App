import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { AuthContext } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../services/auth';

const LoginWithPhone = ({Verificacion}) => {
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { verifyOtpCode } = useContext(AuthContext);
  const [countryCode, setCountryCode] = useState('+57'); 

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Concatenar el código de país con el número
    const fullPhoneNumber = `${countryCode}${phone}`;

    // Enviar el número completo a la función sendOtp
    const result = await sendOtp(fullPhoneNumber);
    setLoading(false);

    if (result.error) {
      console.log('Error al enviar el código: ' + result.error.message);
    } else {
      setStep(2); // Avanza al siguiente paso
    }
  };

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullPhoneNumber = `${countryCode}${phone}`; // Usar el número completo para verificar OTP
    const result = await verifyOtpCode(fullPhoneNumber, otpCode); // Usar la función corregida
    setLoading(false);

    if (result.error) {
      console.log('Error al verificar el código: ' + result.error.message);
    } else if (result.user) {
      const { user } = result;

      // Verificar si faltan datos
      if (!user.name) {
        navigate('/profile'); // Redirigir al perfil si faltan datos
      } else {
        Verificacion(false)
      }
    } else {
      console.log('Error inesperado: No se pudo obtener el usuario.');
    }
  };

  return (
    <div className="auth-container">
      {step === 1 && (
        <div className="w-full flex justify-center items-start">
          <form
            onSubmit={handleSendOtp}
            className="flex justify-center flex-col gap-4 w-[85%]"
          >
            {/* Selección de país */}
            <div className="flex flex-col">
              <label htmlFor="country" className="text-[1.19rem] font-medium text-black ps-1">
                País o región
              </label>
              <select
                id="country"
                value={countryCode}
                onChange={handleCountryChange}
                className="border border-black h-11 rounded-md ps-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
              >
                <option value="+57">Colombia (+57)</option>
                <option value="+1">Estados Unidos (+1)</option>
                <option value="+52">México (+52)</option>
                <option value="+34">España (+34)</option>
                <option value="+44">Reino Unido (+44)</option>
              </select>
            </div>

            {/* Entrada del número de teléfono */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-[1.19rem] font-medium text-black ps-1">
                Número de teléfono
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 border-2 border-r-0 rounded-l-md bg-gray-300 text-gray-700 text-[1.19rem] font-medium">
                  {countryCode}
                </span>
                <input
                  type="number"
                  id="phone"
                  placeholder="3001340812"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="border border-black h-11 w-full rounded-md ps-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
                />
              </div>
            </div>

            {/* Mensaje informativo */}
            <p className="text-xs text-gray-500">
              Te vamos a confirmar el número mensaje de texto. Sujeto a las tarifas estándar
              para mensajes y datos.{' '}
              <a
                href="/privacy-policy"
                className="text-[#de1261] underline hover:text-[#b20e50]"
              >
                Política de privacidad
              </a>
            </p>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!phone}
              className="w-full bg-[#de1261] text-center py-3 text-white text-lg cursor-pointer rounded-md font-semibold mt-4 hover:bg-[#b20e50] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </form>
        </div>

      )}

      {step === 2 && (
        <div className="w-full flex justify-center items-start">
          <form onSubmit={handleVerifyOtp} className="flex justify-center flex-col w-[85%]">
            <div className="flex flex-col">
            <label className="text-[1.19rem] font-medium text-black ps-1" htmlFor="Codigo">Verifica el codigo</label>
            <input
              type="text"
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              className="border border-black h-11 w-full rounded-md ps-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
            />
            </div>
            <button type="submit" disabled={loading}  className="w-full bg-[#de1261] text-center py-3 text-white text-lg cursor-pointer rounded-md font-semibold mt-4 hover:bg-[#b20e50] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginWithPhone;
