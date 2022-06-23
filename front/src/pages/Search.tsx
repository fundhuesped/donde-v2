import React, { useState } from 'react';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import isEmpty from 'lodash/isEmpty';
import { BackButton } from '../components/BackButton';
import { useNavigate } from 'react-router-dom';
import { Pill } from '../components/Pill';

const Search = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const isLocationEmpty = isEmpty(location);

  const handleLocationChange = (event: React.FormEvent<HTMLInputElement>) => {
    setLocation(event.currentTarget.value);
  };

  const handleSearchButtonClicked = () => {
    if (!isLocationEmpty) {
      navigate('/mapa', { state: { location } });
    }
  };

  const handleSearchButtonByLocationClicked = () => {
    const successFunction = (position: GeolocationPosition) => {
      const { coords } = position;
      const { latitude: lat, longitude: lng } = coords;

      navigate('/mapa', { state: { coords: { lat, lng } } });
    };
    const errorFunction = (error: GeolocationPositionError) => {
      console.warn('ERROR(' + error.code + '): ' + error.message);
    };
    const getCurrentPositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(successFunction, errorFunction, getCurrentPositionOptions);
  };

  return (
    <>
      <div className={'mt-2'}>
        <div className={'px-content'}>
          <p className="text-black text-xs mb-2">Estás buscando</p>
          <Pill>Test de HIV</Pill>
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
