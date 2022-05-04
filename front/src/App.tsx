import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios');
function App() {
  const [state, setState] = useState("sarlonga")

  useEffect(()=> {
  async function saraza() {
    const response = await axios.get('http://localhost:3001')
    debugger;
    setState(response.data)
  }
  saraza()
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {state}
        </a>
      </header>
    </div>
  );
}

export default App;
