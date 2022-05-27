import React, {useEffect, useState} from 'react';
import "@fontsource/poppins";
import './App.css';
import {Header} from "./Header";

const axios = require('axios');

function App() {
  const [state, setState] = useState('sarlonga');

  useEffect(() => {
    async function saraza() {
      const response = await axios.get('http://localhost:3001');
      debugger;
      setState(response.data);
    }
    saraza();
  }, []);
  return (
    <div className={"app"}>
      <Header/>
      <p className={"home-text"}>Encontrá los servicios de <strong>salud sexual y reproductiva </strong> que estás necesitando</p>
    </div>
  );
}

export default App;
