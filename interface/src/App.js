import './App.css';
import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page imports for routing
import FrontPage from './components/frontpage'
import StaffInterface from './components/staffInterface/staffinterface' 
import CustomerInterface from './components/customerInterface/customerinterface';
import Header from './components/Header/header';
import CustomerLogin from './components/customerInterface/customerlogin';
import StaffLogin from './components/staffInterface/stafflogin';
import StaffRegister from './components/staffInterface/staffregister'
import CustomerRegister from './components/customerInterface/customerregister'
import Cart from './components/customerInterface/cart'
import Orders from './components/customerInterface/orders'
function App(){
 
  const[data, setData] = useState(); 
  
  let query = {"type": 'test'}

  return (
    <div className="App" 
    style={{backgroundColor: '#333454', height: '100vh', overflowX: "hidden", overflowY: 'auto'}}>
      <Header />
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/customer" element={<CustomerInterface/>} />
            <Route path="/staff" element={<StaffInterface/>} />
            <Route path="/customer-login" element={<CustomerLogin/>} />
            <Route path="/staff-login" element={<StaffLogin/>} />
            <Route path='/register-staff' element={<StaffRegister />} />
            <Route path='/register-customer' element={<CustomerRegister />} />
            <Route path='/cart' element={<Cart />}/>
            <Route path='/orders' element={<Orders />}/>
            <Route element={FrontPage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
