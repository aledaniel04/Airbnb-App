import { Routes, Route } from 'react-router-dom'
import { Auth } from '../components/Auth'
import UserProfile  from '../pages/userProfile'
import Home from '../pages/home'
import FormularioAirbnb from '../pages/FormularioAirbnb'
import MisPropiedades from '../pages/MisPropiedades'
import PropertyDetails from '../pages/PropertyDetails'
import FavoriteProperty from '../components/FavoriteProperty'

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/profile' element={<UserProfile/>} />
      <Route path='/Form' element={<FormularioAirbnb/>} />
      <Route path='/propiedades' element={<MisPropiedades/>} />
      <Route path='/infoproperty/:slug' element={<PropertyDetails/>} />
      <Route path='/favorite' element={<FavoriteProperty/>} />
    </Routes>
  )
}

export default AppRouter