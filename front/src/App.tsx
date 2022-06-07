import React from 'react';
import { Header } from './Header';
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Search from "./pages/Search";

const App = () => (
    <div className={'py-4  px-1 mx-auto  max-w-sm'}>
        <Header/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buscar" element={<Search />} />
        </Routes>
    </div>
);

export default App;
