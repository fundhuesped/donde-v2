import React from 'react';
import { Header } from './Header';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import { Map } from './pages/Map';
import { Establishment } from './pages/Establishment';

const App = () => (
  <div className={'min-h-screen flex flex-col'}>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/mapa" element={<Map centerLat={-34.602086} centerLng={-58.384543} zoom={13} />} />
      <Route path="/establecimiento" element={<Establishment />} />
    </Routes>
  </div>
);

export default App;
