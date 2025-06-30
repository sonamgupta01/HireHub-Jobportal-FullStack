import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar/>
      <Outlet />
      
    </>
  )
}

export default App



// to run : cd job-portal-client and then npm run dev
// npm install react-hook-form
// npm install react-select
//npm install bcryptjs jsonwebtoken