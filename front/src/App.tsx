import React from 'react';
import { Header } from './Header';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Map from './pages/Map';
import { Establishment } from './pages/Establishment';
import { ReactComponent as TestDeVIH } from './assets/images/TestDeVIH.svg';

const exampleEstablishment = {
  name: 'BIOLAB SRL',
  type: 'Privado',
  address: 'M. Moreno 449, Santa Rosa, La Pampa',
  addressNotes: '',
  businessHours: 'Lunes a viernes 7 a 11 Hs',
  services: [{ id: 'test-hiv', name: 'Test de HIV', icon: <TestDeVIH /> }],
  website: 'https://www.biolabsrl.com.ar',
  phone: '02954814366',
  whatsAppPhone: '2954427081',
  additionalInfo: 'Se necesitan 8 Hs de ayuno. El resultado es  ario.',
};

const App = () => (
  <div className={'min-h-screen flex flex-col'}>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/mapa" element={<Map />} />
      <Route path="/establecimiento" element={<Establishment {...exampleEstablishment} />} />
    </Routes>
  </div>
);

export default App;
