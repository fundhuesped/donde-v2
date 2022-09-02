import isEmpty from 'lodash/isEmpty';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { RefObject, useEffect, useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import { Pill } from '../components/Pill';
import { Coordinates } from '../model/map';
import { prismaClient } from '../server/prisma/client';

type AvailableService = {
  id: string;
  name: string;
  icon: string;
};

type ServerSideProps = {
  googleMapsApiKey: string;
  availableServices: AvailableService[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
  const services = await prismaClient.service.findMany();
  return {
    props: {
      availableServices: services,
      googleMapsApiKey,
    },
  };
};

const Search: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableServices }) => {
  const router = useRouter();

  const { ref: autocompleteInputRef }: { ref: RefObject<HTMLInputElement> } = usePlacesWidget({
    apiKey: googleMapsApiKey,
    onPlaceSelected: (place) => {
      setSearchLocation(place.formatted_address);
      setLocation(place.formatted_address);
      setCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    },
    options: {
      componentRestrictions: { country: 'ar' },
      types: ['sublocality', 'locality', 'street_address', 'intersection'],
    },
  });

  const servicesQueryParam = router.query.services;
  const searchedServiceIds = servicesQueryParam
    ? Array.isArray(servicesQueryParam)
      ? servicesQueryParam
      : [servicesQueryParam]
    : [];
  const searchedServices =
    searchedServiceIds && searchedServiceIds.length !== 0
      ? availableServices.filter((service) => searchedServiceIds.includes(service.id))
      : availableServices;
  const services = searchedServices.map((service) => service);

  const [searchLocation, setSearchLocation] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<Coordinates>({} as Coordinates);
  const [isMissingSearchInfo, setIsMissingSearchInfo] = useState(true);

  useEffect(() => {
    setIsMissingSearchInfo(isEmpty(location) || isEmpty(coords));
  }, [location, coords]);

  const handleSearchLocationChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchLocation(event.currentTarget.value);
  };

  const handleSearchButtonClicked = () => {
    if (!isMissingSearchInfo) {
      router.push({
        pathname: '/establecimientos',
        query: {
          coords: encodeURIComponent(JSON.stringify(coords)),
          services: searchedServiceIds,
        },
      });
    }
  };

  const handleSearchButtonByLocationClicked = () => {
    router.push({
      pathname: '/establecimientos',
      query: {
        services: searchedServiceIds,
      },
    });
  };

  return (
    <>
      <Head>
        <title>Dónde - Buscar Servicios</title>
      </Head>

      <div className={'mt-2'}>
        <div className={'px-content'}>
          <p className="text-black text-xs mb-2">Estás buscando</p>
          {services.map((service) => (
            <Pill key={service.id} className={'mb-1 mr-1 inline-block'}>
              {service.name}
            </Pill>
          ))}
        </div>
      </div>
      <MainContainer className={'mt-8 pt-8 lg:mx-auto lg:grow-0 lg:p-8 lg:min-w-desktop'}>
        <h2 className={'text-xl text-black font-title font-bold'}>¿En qué lugar estas buscando?</h2>
        <p className={'text-xs text-black mt-2 mb-4'}>
          Podés buscar por ciudad, departamento o barrio. También podés buscar por el nombre o la dirección de un centro que ya
          conozcas.
        </p>
        <input
          ref={autocompleteInputRef}
          className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-4'}
          placeholder={'Ingresá la ubicación'}
          value={searchLocation}
          onChange={handleSearchLocationChange}
        />
        <div className={'mt-8'}>
          <Button
            className={'bg-white w-full lg:mx-auto lg:max-w-[24rem]'}
            disabled={isMissingSearchInfo}
            type={'primary'}
            onClick={handleSearchButtonClicked}
          >
            Buscar
          </Button>
          <Button
            className={'w-full mt-4 lg:max-w-[24rem] lg:mx-auto'}
            type={'secondary'}
            onClick={handleSearchButtonByLocationClicked}
          >
            Buscar por mi ubicación actual
          </Button>
        </div>
      </MainContainer>
    </>
  );
};

export default Search;
