import Register from "./pages/Register";
import Home from './Home'
import Login from './pages/Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App(){

  return(

    <BrowserRouter>
    <Routes>
            <Route path="/register" element={<Register/>} />
            <Route path="/" element={<Login/>} />
            <Route path="/home" element={<Home/>}  />

    </Routes>
    
    
    </BrowserRouter>
  )
}
export default App;