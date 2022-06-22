import React, { useState } from 'react';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import isEmpty from 'lodash/isEmpty';
import { BackButton } from '../components/BackButton';
import { useNavigate } from 'react-router-dom';

const SelectedService = (props: { label: string }) => (
  <Button type="secondary" className="h-8 mt-2 mb-1" disabled={true}>
    {' '}
    {props.label}{' '}
  </Button>
);

const Search = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const isLocationEmpty = isEmpty(location);

  const handleLocationChange = (event: React.FormEvent<HTMLInputElement>) => {
    setLocation(event.currentTarget.value);
  };

  const handleSearchButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLocationEmpty) {
      navigate('/mapa', { state: { location } });
    }
  };

  const handleSearchButtonByLocationClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      <div>
        <BackButton />
        <div className={'px-4'}>
          <p className="mt-2"> Estás buscando </p>
          <SelectedService label={'Test de HIV'} />
        </div>
      </div>
      <MainContainer>
        <h1 className={'font-title text-lg px-2 my-6 text-black font-bold'}>¿En qué lugar estas buscando?</h1>
        <p className={'text-xs px-2 my-6 text-black'}>
          Podés buscar por ciudad, departamento o barrio. También podés buscar por el nombre o la dirección de un centro que ya
          conozcas.
        </p>
        <input
          className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0'}
          placeholder={'Ingresá la ubicación'}
          value={location}
          onChange={handleLocationChange}
        />
        <Button
          className={'bg-white w-full my-5'}
          disabled={isLocationEmpty}
          type={'primary'}
          onClick={handleSearchButtonClicked}
        >
          Buscar
        </Button>
        <Button className={'w-full my-5'} type={'secondary'} onClick={handleSearchButtonByLocationClicked}>
          Buscar por mi ubicación actual
        </Button>
      </MainContainer>
    </>
  );
};

export default Search;
