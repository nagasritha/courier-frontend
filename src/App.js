import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Admin from './components/Admin'
import CallProduct from './components/CallProduct'
import './App.css'

const App=()=><BrowserRouter>
<Routes>
<Route exact path='/login' element={<Login/>}/>
<Route exact path='/' element={<Home/>}/>
<Route exact path='/admin' element={<Admin/>}/>
<Route exact path='/product/:id' element={<CallProduct/>}/>  
</Routes>
</BrowserRouter>

export default App
