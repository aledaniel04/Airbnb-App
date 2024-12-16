import React, { useEffect, useState } from 'react'
import LoginWithPhone from './LoginWithPhone'
import { LoginForm } from './LoginForm';
import SignUpForm from './SignUpForm';
import { signInWithFacebook, signInWithGoogle } from '../services/auth';
import { Icon } from '@iconify/react/dist/iconify.js'
import { Navbar } from './Navbar';

export const Auth = ({ cerrarPopup, iniciarSesion }) => {
  const [step, setStep] = useState(1)
  
  useEffect(() => {
    if (iniciarSesion) {
      setStep(iniciarSesion); // Configura el paso inicial al recibir la prop
    }
  }, [iniciarSesion]);
  
  return (
    <div className='flex flex-col w-screen h-screen bg-white md:h-[90%] md:rounded-2xl md:w-[45%] overflow-y-auto md:overflow-y-hidden'>
      <div className='flex md:justify-between justify-center border-b-2 p-4 items-center'>
        <div onClick={() => { cerrarPopup(false) }} className='hidden md:flex text-[2rem] text-black cursor-pointer'>
          <Icon icon="material-symbols:close" />
        </div>
        <div>
          {
            step == 1 && (<h1 className='flex justify-center font-semibold text-[1.5rem]'>Registro</h1>)
          }
          {
            step == 2 && (<h1 className='flex justify-center font-semibold text-[1.5rem]'>Inicia sesión</h1>)
          }
          {
            step == 3 && (<h2 className="flex justify-center font-semibold text-[1.5rem]">Iniciar sesión con teléfono</h2>)
          }
        </div>
        <div className='hidden md:flex md:w-10'></div>
      </div>
      <div className='md:overflow-y-scroll '>
        <p className='text-[1.7rem] font-semibold p-5 ms-2 md:ms-7'>Te damos la bienvenida a Airbnb</p>
        {
          step == 1 && (
            <>
              <div><SignUpForm siguientePaso={setStep} /></div>
              <p className='text-center mt-3'>¿Ya tienes una cuenta? <span className='font-bold cursor-pointer' onClick={() => setStep(2)}>Inicia sesión</span></p>
            </>
          )
        }
        {
          step == 2 && (
            <>
              <div ><LoginForm Finalizar={cerrarPopup} /></div>
              <p className='text-center mt-3'>¿Aun no tienes una cuenta? <span className='font-bold cursor-pointer' onClick={() => setStep(1)}>Registrate</span></p>
            </>
          )
        }
        {
          step == 3 && (
            <div ><LoginWithPhone Verificacion={cerrarPopup}/></div>
          )
        }
        <div className='md:w-full md:h-[50%] flex flex-col gap-4 justify-center items-center md:py-4'>
          {
            step == 3 ?
              <button onClick={() => setStep(1)} className=' w-[85%] mt-5 text-black py-1 text-[1.361rem] border border-black cursor-pointer rounded-[0.5rem] font-semibold flex justify-center items-center ps-4'>
                <p className='font-medium'>Continuar con un correo</p>
              </button>
              :
              <button onClick={() => setStep(3)} className='w-[85%] mt-5 text-black  text-center py-1 text-[1.361rem] border border-black cursor-pointer rounded-[0.5rem] font-semibold flex justify-center items-center ps-4'>
                <p className='font-medium'>Continuar con un telefono</p>
              </button>
          }
          <button onClick={signInWithGoogle} className='w-[85%] text-black  text-center py-1 text-[1.361rem] border border-black cursor-pointer rounded-[0.5rem] font-semibold flex justify-between items-center ps-4'>
            <Icon icon="flat-color-icons:google" /> <p className='font-medium'>Google</p> <div></div>
          </button>
          <button onClick={signInWithFacebook} className='w-[85%] border text-center py-1 text-black text-[1.361rem] border-black cursor-pointer rounded-[0.5rem] font-semibold flex justify-between items-center ps-4'>
            <Icon icon="devicon:facebook" />
            <p className='font-medium'>Facebook</p>
            <div></div>
          </button>
        </div>
      </div>
      <div className='mt-24 md:hidden'>
        <Navbar />
      </div>
    </div>

  )
}
