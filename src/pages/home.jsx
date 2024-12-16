import { Category } from '../components/Category'
import { Filter } from '../components/Filter.jsx'
import PriceToggle from '../components/PriceToggle'
import { Navbar } from '../components/Navbar'
import NavbarTop from '../components/NavbarTop'
import AirbnbSearchBarMovil from '../components/AirbnbSearchBarMovil'
import ShowProperties from '../components/ShowProperties'
import { useState } from 'react'
import AirbnbSearchBar from '../components/AirbnbSearchBar'
import logoAirbnb from '../assets/logoAirbnb.png'
import { Link } from 'react-router-dom'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(null);
  return (
    <div>
      <div className='flex md:hidden justify-center p-4'>
        <AirbnbSearchBarMovil onSearch={setSelectedFilters}/>
      </div>
      <div className=' fixed top-0 left-0 w-screen md:border-b-2 hidden md:flex justify-around bg-white z-50 items-center py-4 pr-8'>
        <Link className='ms-4'>
          <img width={150} src={logoAirbnb} alt="" />
        </Link>
        <div>
          <AirbnbSearchBar onSearch={setSelectedFilters}/>
        </div>
        <NavbarTop />
      </div>
      <div className='flex justify-start gap-5 items-center mt-0 md:mt-28'>
        <Category onCategorySelect={setSelectedCategory} />
        <Filter />
        <PriceToggle />
      </div>
      <div className="mx-auto px-6 md:px-10">
        <ShowProperties selectedCategory={selectedCategory} filters={selectedFilters}/>
      </div>
      <div>
        <Navbar />
      </div>
    </div>
  )
}

export default Home