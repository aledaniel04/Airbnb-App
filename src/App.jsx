import './App.css'
import AuthProvider from './context/AuthContext'
import AppRouter from './routes'
// import { Login } from './pages/login'

function App() {
  return (
    <>

        <AuthProvider>
          
          <AppRouter/>
          
        </AuthProvider>

    </>
  )
}

export default App
