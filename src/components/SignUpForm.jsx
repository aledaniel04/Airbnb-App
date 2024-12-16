import React from 'react';
import useForm from '../hooks/useForm';
import { registerUser} from '../services/auth';


const initialState = {
  fullName: '',
  emailr: '',
  passwordr: '',
};

const SignUpForm = ({siguientePaso}) => {
  const { formValues, handleInputChange, reset } = useForm(initialState);
  const { emailr, passwordr, fullName } = formValues;

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const { data, error } = await registerUser(emailr, passwordr, fullName);

    if (error) {
      console.error('Error durante el registro:', error.message);
    } else {
      console.log('Registro exitoso:', data);
      reset(); 
      siguientePaso(2)
    }
  };

  return (
    <>
      <div className='w-full flex justify-center items-start'>
      <form onSubmit={handleSubmit} className="flex justify-center flex-col gap-4 w-[85%]">
        <div className="flex flex-col">
          <label htmlFor="fullname" className="text-[1.19rem] font-medium text-black ps-1">
           Nombre completo
          </label>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={handleInputChange}
            className=" border border-black h-11 rounded-md ps-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
            required
            placeholder='Ingresa tu nombre'
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-[1.19rem] font-medium text-black ps-1">
            Correo
          </label>
          <input
            type="email"
            name="emailr"
            value={emailr}
            onChange={handleInputChange}
            className=" border border-black h-11 rounded-md ps-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
            required
            placeholder='example@gmail.com'
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[1.19rem] font-medium text-black ps-1">
            Contraseña
          </label>
          <input
            type="password"
            name="passwordr"
            value={passwordr}
            onChange={handleInputChange}
            className="border border-black h-11 rounded-md ps-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
            required
            placeholder='crea una contraseña'
          />
        </div>
        <button
              type="submit"
              disabled={!fullName}
              className="w-full bg-[#de1261] text-center py-3 text-white text-lg cursor-pointer rounded-md font-semibold mt-4 hover:bg-[#b20e50] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Registrate
            </button>
      </form>
      </div>
    </>
  );
};

export default SignUpForm;
