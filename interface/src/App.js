import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'

function App() {
  const[data, setData] = useState();

  useEffect(()=>{
      fetch('/api').then((res)=>res.json).then((data)=>setData(data.message))
   }
)

  return (
    <div className="App">
      <header className="App-header">
        <p>
            {data ? {data} : "loading..."}
        </p>
      </header>
    </div>
  );
}

export default App;
