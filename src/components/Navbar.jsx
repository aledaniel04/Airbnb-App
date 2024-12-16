import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js';
import { AuthContext } from '../context/AuthContext';
import { Auth } from './Auth';

export const Navbar = () => {
    const { user } = useContext(AuthContext)
    const [popup, setPopup] = useState(false);

    return (
        <>
            <div className='flex text-xs md:hidden bg-[#ebe9e9] fixed bottom-0 w-screen justify-around p-3 rounded-t-[20px] z-40'>
                <Link to={'/'} className='flex flex-col justify-center items-center'>
                    <Icon className='text-[2rem]' icon="material-symbols:search" />
                    <p>Explora</p>
                </Link>
                <Link to={'/favorite'} className='flex flex-col justify-center items-center'>
                    <Icon className='text-[2rem]' icon="material-symbols:favorite-outline" />
                    <p>Favoritos</p>
                </Link>
                {user ?
                    <Link to={'/propiedades'} className='flex flex-col justify-center items-center'>
                        <Icon className='text-[2rem]' icon="ph:house-line" />
                        <p>Espacios</p>
                    </Link>
                    :
                    <></>
                }

                <div>

                    {
                        user ? <Link className='flex flex-col justify-center items-center' to={'/profile'}>
                            <Icon className='text-[2rem]' icon="gg:profile" />
                            <p>Perfil</p>
                        </Link>
                            : <div className='flex flex-col justify-center items-center' onClick={() => { setPopup(true) }}>
                                <Icon className='text-[2rem]' icon="gg:profile" />
                                <p>Iniciar sesion</p>
                            </div>
                    }

                </div>
            </div>
            {
                popup && (
                    <div className='flex md:hidden fixed z-10 top-0 left-0 w-screen h-screen justify-center items-center bg-[#000000ad]'>
                        <Auth cerrarPopup={setPopup} />
                    </div>
                )
            }
        </>
    )
}
