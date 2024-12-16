import React, { useContext } from 'react'
import useForm from '../hooks/useForm'
import { AuthContext } from '../context/AuthContext'
import { loginUser, signInWithFacebook, signInWithGoogle, signOut } from '../services/auth'

const initialState = {
  email: '',
  password: ''
}

export const LoginForm = ({Finalizar}) => {
  const { user } = useContext(AuthContext)

  const { formValues, handleInputChange, reset } = useForm(initialState)
  const { email, password } = formValues

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamar al servicio loginUser con los valores del formulario
    const { data, error } = await loginUser(email, password);

    if (error) {
      console.error('Error durante el inicio de sesión:', error.message);
    } else {
      reset(); // Reinicia el formulario
      Finalizar(false)
    }
  };

  return (
    <>
      <div className='w-full h-[50%] flex justify-center items-start'>
        <form onSubmit={handleSubmit} className="flex justify-center flex-col gap-4 w-[85%]">
          <div className="flex flex-col">
            <label className="text-[1.19rem] font-medium text-black ps-1" htmlFor="email">Correo</label>
            <input className=" border border-black h-11 rounded-md ps-2" type="email" required placeholder='example@gmail.com' name='email' value={email} onChange={handleInputChange} />
          </div>
          <div className="flex flex-col">
            <label className="text-[1.19rem] font-medium text-black ps-1" htmlFor="password">Contraseña</label>
            <input className=" border border-black h-11 rounded-md ps-2" type='password' required placeholder='ingresa tu contraseña' name='password' value={formValues.password} onChange={handleInputChange} />
          </div>
          <button
              type="submit"
              disabled={!email}
              className="w-full bg-[#de1261] text-center py-3 text-white text-lg cursor-pointer rounded-md font-semibold mt-4 hover:bg-[#b20e50] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Iniciar sesión
            </button>
        </form>
      </div>
    </>
  )
}