import React from 'react';
import { Header } from './Header';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import { Map } from './pages/Map';

const App = () => (
  <div className={'min-h-screen flex flex-col'}>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/mapa" element={<Map />} />
    </Routes>
  </div>
);

export default App;
