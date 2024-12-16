import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

export const Filter = () => {
  return (
    <div className='hidden md:flex justify-center items-center gap-2 text-[1rem] border-2 rounded-md p-4 h-12'>
        <Icon icon="mage:filter-fill" />
        <p>filtros</p>
    </div>
  )
}
