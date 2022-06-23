import React, { useState } from 'react';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pill } from '../components/Pill';
import servicesData from '../assets/services.json';

type LocationState = {
  services: string[];
};

const Search = () => {
  const navigate = useNavigate();

  const { services: searchedServiceIds } = useLocation().state as LocationState;
  const searchedServices =
    searchedServiceIds && searchedServiceIds.length !== 0
      ? servicesData.filter((service) => searchedServiceIds.includes(service.id))
      : servicesData;
  const services = searchedServices.map((service) => service);

  const [location, setLocation] = useState('');
  const isLocationEmpty = location.trim() === '';

  const handleLocationChange = (event: React.FormEvent<HTMLInputElement>) => {
    setLocation(event.currentTarget.value);
  };

  const handleSearchButtonClicked = () => {
    if (!isLocationEmpty) {
      navigate('/establecimientos', { state: { location } });
    }
  };

  const handleSearchButtonByLocationClicked = () => {
    navigate('/establecimientos');
  };

  return (
    <>
      <div className={'mt-2'}>
        <div className={'px-content'}>
          <p className="text-black text-xs mb-2">Estás buscando</p>
          {services.map((service) => (
            <Pill key={service.id}>{service.name}</Pill>
          ))}
        </div>
      </div>
      <MainContainer className={'mt-8 pt-8'}>
        <h2 className={'text-xl text-black font-title font-bold'}>¿En qué lugar estas buscando?</h2>
        <p className={'text-xs text-black mt-2 mb-4'}>
          Podés buscar por ciudad, departamento o barrio. También podés buscar por el nombre o la dirección de un centro que ya
          conozcas.
        </p>
        <input
          className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-4'}
          placeholder={'Ingresá la ubicación'}
          value={location}
          onChange={handleLocationChange}
        />
        <div className={'mt-8'}>
          <Button className={'bg-white w-full'} disabled={isLocationEmpty} type={'primary'} onClick={handleSearchButtonClicked}>
            Buscar
          </Button>
          <Button className={'w-full mt-4'} type={'secondary'} onClick={handleSearchButtonByLocationClicked}>
            Buscar por mi ubicación actual
          </Button>
        </div>
      </MainContainer>
    </>
  );
};

export default Search;
