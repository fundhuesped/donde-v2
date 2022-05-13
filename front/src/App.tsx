import React, { useEffect, useState } from 'react';
import './App.css';
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
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    {state}
                </a>
            </header>
        </div>
    );
}

export default App;
