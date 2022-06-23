import React, { useState } from 'react';
import { Header } from './Header';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Map from './pages/Map';
import { Establishment } from './pages/Establishment';
import About from './pages/About';
import FAQ from './pages/FAQ';

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
        <Route path="/establecimientos/:id" element={<Establishment />} />
        <Route path="/sobre-donde" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </div>
  );
};

export default App;
