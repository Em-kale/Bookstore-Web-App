
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

function App() {
  const[data, setData] = useState();

  useEffect(()=>{
      fetch("/api").then((res)=>res.json()).then((info)=>setData(info.message))

    }
)


  return (
    <div className="App" 
    style={{backgroundColor: '#333454', height: '100vh', overflow: 'hidden'}}>
      <Header />
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/customer" element={<CustomerInterface/>} />
            <Route path="/staff" element={<StaffInterface/>} />
            <Route path="/customer-login" element={<CustomerLogin/>} />
            <Route path="/staff-login" element={<StaffLogin/>} />
            <Route element={FrontPage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
