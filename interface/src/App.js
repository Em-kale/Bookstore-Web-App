import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page imports for routing
import FrontPage from './components/frontpage'
import StaffInterface from './components/staffInterface/staffinterface' 
import CustomerInterface from './components/customerInterface/customerinterface';

function App() {
  const[data, setData] = useState();

  useEffect(()=>{
      fetch("/api").then((res)=>res.json()).then((info)=>setData(info.message))

    }
)


  return (
    <div className="App">
      {/* <header className="App-header">
        <p>
        {data ? `${data}` : "loading..."}
        </p>
      </header> */}
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/customer" element={<CustomerInterface/>} />
            <Route path="/staff" element={<StaffInterface/>} />
            <Route element={FrontPage} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
