import React, { useState, useEffect, useRef } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';
import { Icon } from '@iconify/react/dist/iconify.js';
import populares from '../assets/populares.png';
import CasasVistasIncreibles from '../assets/VistasIncreibles.png';
import islas from '../assets/islas.png';
import mansiones from '../assets/mansiones.png';
import habitaciones from '../assets/habitaciones.png';
import piscinas from '../assets/piscinas.png';
import granjas from '../assets/granjas.png';
import playas from '../assets/playas.png';
import barcos from '../assets/barcos.png';
import cabaña from '../assets/cabaña.png';

export const Category = ({ onCategorySelect }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(true);
    const swiperRef = useRef(null);

    const categories = [
        { label: 'Populares', value: '', img: populares },
        { label: 'Vista Increibles', value: 'Vistas Increíbles', img: CasasVistasIncreibles },
        { label: 'islas', value: 'Islas', img: islas },
        { label: 'Mansiones', value: 'Mansiones', img: mansiones },
        { label: 'Habitaciones', value: 'Habitaciones', img: habitaciones },
        { label: 'piscinas', value: 'Piscinas', img: piscinas },
        { label: 'granjas', value: 'Granjas', img: granjas },
        { label: 'playas', value: 'Playas', img: playas },
        { label: 'barcos', value: 'Barcos', img: barcos },
        { label: 'Cabaña', value: 'Cabaña', img: cabaña },
    ];

    const handleCategoryClick = (index, value) => {
        setSelectedIndex(index);
        onCategorySelect(value); // Enviar categoría seleccionada al componente padre
    };

    const handleNavigationUpdate = (swiper) => {
        setShowPrev(!swiper.isBeginning);
        setShowNext(!swiper.isEnd);
    };

    useEffect(() => {
        if (swiperRef.current) {
            handleNavigationUpdate(swiperRef.current); // Aseguramos que los botones se actualicen en la primera renderización
        }
    }, []);

    return (
        <>
            <div className='flex md:hidden justify-between hide-scrollbar ms-2 mt-4 items-center'>
                {categories.map((category, index) => (
                    <button key={index} onClick={() => handleCategoryClick(index, category.value)}>
                        <div
                            className={`w-24 flex flex-col justify-center items-center pb-3 ${selectedIndex === index ? ' border-solid border-b-2 border-black' : ''}`}
                        >
                            <img className='w-8' src={category.img} alt="" />
                            <p className='font-bold text-[0.8rem] text-[#333333] mt-1'>{category.label}</p>
                        </div>
                    </button>
                ))}
            </div>
            <div className=" hidden md:flex justify-start items-center w-[55rem] ">
                {/* Botón "Prev" personalizado */}
                <button
                    className={`custom-prev bg-white text-black rounded-full border-2 w-10 h-10 items-center justify-center ms-8 z-10 ${showPrev ? 'flex' : 'hidden'
                        }`}
                >
                    <Icon icon="ooui:next-rtl" />
                </button>

                {/* Carrusel */}
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    modules={[Navigation]}
                    slidesPerView={7}
                    spaceBetween={10}
                    className="w-full ms-2 mt-4"
                    onSlideChange={(swiper) => handleNavigationUpdate(swiper)}
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index} className="w-[10rem] px-8">
                            <div className="flex justify-start">
                                <button onClick={() => handleCategoryClick(index, category.value)}>
                                    <div
                                        className={`w-24 flex flex-col justify-center items-center pb-3 ${selectedIndex === index ? 'border-solid border-b-2 border-black' : ''
                                            }`}
                                    >
                                        <img className="w-8" src={category.img} alt="" />
                                        <p className="font-bold text-[0.8rem] text-[#333333] mt-1">
                                            {category.label}
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Botón "Next" personalizado */}
                <button
                    className={`custom-next bg-white text-black rounded-full border-2 w-10 h-10 items-center justify-center  ${showNext ? 'flex' : 'hidden'
                        }`}
                >
                    <Icon icon="ooui:next-ltr" />
                </button>
            </div>
        </>
    );
};
