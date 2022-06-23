import React, { useState } from 'react';
import { Header } from './Header';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Map from './pages/Map';
import { Establishment } from './pages/Establishment';
import { ReactComponent as TestDeVIH } from './assets/images/TestDeVIH.svg';
import About from './pages/About';
import FAQ from './pages/FAQ';

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

const App = () => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const handleDisableScroll = () => {
    setIsScrollDisabled(!isScrollDisabled);
  };
  const showScroll = isScrollDisabled ? 'overflow-hidden' : 'overflow-auto';
  return (
    <div className={`min-h-screen flex flex-col ${showScroll}`}>
      <Header onMenuOpening={handleDisableScroll} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/establecimientos" element={<Map />} />
        <Route path="/establecimientos/:id" element={<Establishment {...exampleEstablishment} />} />
        <Route path="/sobre-donde" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </div>
  );
};

export default App;
