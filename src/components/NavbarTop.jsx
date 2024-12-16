import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js';
import { AuthContext } from '../context/AuthContext';
import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Auth } from './Auth';
import { signOut } from '../services/auth';

const NavbarTop = () => {
    const { user } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popup, setPopup] = React.useState(false);
    const [step, setStep] = React.useState(1); // Nuevo estado para controlar el formulario
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const iniciarSesion = () => {
        setPopup(true); 
        setStep(2); 
    }

    return (
        <div>
            <div>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip onClick={handleClick} className='flex justify-center items-center bg-gray-100 rounded-xl px-3 border-2 cursor-pointer' title="Account settings">
                        <div>
                            <Icon className='text-[1.3rem]' icon="material-symbols:menu" />
                            <IconButton
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                {user ? (
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 font-bold text-[1.5rem]">
                                        {user.avatar ? (
                                            <img
                                                className="w-full h-full rounded-full object-cover"
                                                src={user.avatar}
                                                alt="User Avatar"
                                            />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                ) : (
                                    <div className="navbar-end flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-800">
                                            <Icon className='text-[1.5rem]' icon="mdi:user" />
                                        </div>
                                    </div>
                                )}
                            </IconButton>
                        </div>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {user ?
                        <div>
                            <Link to={'/favorite'}>
                            <MenuItem onClick={handleClose}>
                                Lista de favoritos
                            </MenuItem>
                            </Link>
                            <Link to={'/propiedades'}>
                            <MenuItem onClick={handleClose}>
                                Mis Propiedades
                            </MenuItem>
                            </Link>
                        </div>
                        :
                        <div>
                            <MenuItem onClick={handleClose}>
                                <p className='cursor-pointer' onClick={iniciarSesion}>Iniciar sesión</p>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <p className='cursor-pointer' onClick={() => { setPopup(true); setStep(1); }}>Regístrate</p>
                            </MenuItem>
                        </div>
                    }
                    {
                        user ?
                            <div>
                                <Link to={'/form'}>
                                <MenuItem onClick={handleClose}>
                                    Pon tu espacio en Airbnb
                                </MenuItem>
                                </Link>
                                <Divider />
                                <MenuItem onClick={handleClose}>
                                    <Link to={'/profile'}>
                                        Perfil
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <p className='cursor-pointer' onClick={signOut}>Cerrar sesión</p>
                                </MenuItem>
                            </div>
                            :
                            <div></div>
                    }
                </Menu>
            </div>
            {
                popup && (
                    <div className='hidden md:flex fixed z-10 top-0 left-0 w-screen h-screen justify-center items-center bg-[#000000ad]'>
                        <Auth cerrarPopup={setPopup} iniciarSesion={step} />
                    </div>
                )
            }
        </div>
    )
}

export default NavbarTop;
