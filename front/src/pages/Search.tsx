import React, { useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import MainContainer from '../components/MainContainer';
import isEmpty from 'lodash/isEmpty';

const SelectedService = (props: { label: string }) => (
  <Button type="secondary" className="h-8 mt-2 mb-1" disabled={true}>
    {' '}
    {props.label}{' '}
  </Button>
);

const Search = () => {
  const [ubicacion, setUbicacion] = useState('');

  const handleUbicacionChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUbicacion(event.currentTarget.value);
  };

  const isDisabled = isEmpty(ubicacion);

  return (
    <>
      <div>
        <Link to="/">
          <ChevronLeftIcon className="h-8 w-8 ml-2 text-donde-gray-600" />
        </Link>
        <div className={'px-4'}>
          <p className="mt-2"> Estás buscando </p>
          <SelectedService label={'Test de ITS'} />
        </div>
      </div>
      <MainContainer>
        <h1 className={'text-xl px-2 my-6 text-donde-gray-800 font-semibold'}>¿En qué lugar estas buscando?</h1>
        <p className={'text-xs px-2 my-6 text-donde-gray-800'}>
          Podés buscar por ciudad, departamento o barrio. También podés buscar por el nombre o la dirección de un centro que ya
          conozcas.
        </p>
        <input
          className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0'}
          placeholder={'Ingresá la ubicación'}
          value={ubicacion}
          onChange={handleUbicacionChange}
        />
        <Button className={'bg-white w-full my-5'} disabled={isDisabled} type={'primary'}>
          Buscar
        </Button>
        <Button className={'w-full my-5'} type={'secondary'}>
          Buscar por mi ubicación actual
        </Button>
      </MainContainer>
    </>
  );
};

export default Search;
