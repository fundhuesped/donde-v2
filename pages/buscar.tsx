import isEmpty from 'lodash/isEmpty';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { RefObject, useEffect, useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { Button } from '../components/Buttons/Button';
import MainContainer from '../components/MainContainer';
import { Pill } from '../components/Pill';
import { GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS, GET_DYNAMIC_GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS } from '../config/thirdParty';
import { Coordinates } from '../model/map';
import { Service } from '../model/services';
import { prismaClient } from '../server/prisma/client';

type ServerSideProps = {
  googleMapsApiKey: string;
  availableServices: Service[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }

  const services = await prismaClient.service.findMany({
    include: {
      subservices: true,
    },
  });
  return {
    props: {
      availableServices: services,
      googleMapsApiKey,
    },
  };
};

const Search: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableServices }) => {
  const [country, setCountry] = useState<string | undefined>('');

  useEffect(() => {
    const getCountryByUserIp = async () => {
      const response = await fetch('https://api.country.is');
      const country_location = await response.json();
      setCountry(country_location.country);
    };
    getCountryByUserIp();
  }, []);

  console.log(country, 'country');
  //  {country: 'AR', ip: '186.122.181.188'}

  const router = useRouter();

  const { ref: autocompleteInputRef }: { ref: RefObject<HTMLInputElement> } = usePlacesWidget({
    apiKey: googleMapsApiKey,
    onPlaceSelected: (place) => {
      setSearchLocation(place.formatted_address);
      setLocation(place.formatted_address);
      setCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    },
    options: GET_DYNAMIC_GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS(country),
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
          searchLocation: searchLocation,
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

  const asd = GET_DYNAMIC_GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS(country);
  console.log(asd, 'asd');

  return (
    <div className="flex flex-wrap flex-grow content-start justify-center lg:bg-modal-image lg:bg-white ">
      <Head>
        <title>Dónde - Buscar Servicios</title>
      </Head>

      <div className={'p-0 lg:p-3.5'}>
        <div className={'px-content'}>
          <p className="text-black text-xs mb-2 mt-4">Estás buscando</p>
          {services.map((service) => (
            <Pill key={service.id} className={'text-dark-gray mb-1 mr-1 inline-block'}>
              {service.name}
            </Pill>
          ))}
        </div>
      </div>
      <MainContainer
        className={'w-full h-[calc(100vh_-_100px)] lg:h-full lg:w-3/5 lg:mx-4 mt-4 pt-8 lg:py-8 lg:px-8 lg:flex-grow-0'}
      >
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
        <div className={'mt-8 lg:flex lg:justify-evenly'}>
          <Button
            className={'bg-white w-full lg:max-w-[24rem]'}
            disabled={isMissingSearchInfo}
            type={'primary'}
            onClick={handleSearchButtonClicked}
          >
            Buscar
          </Button>
          <Button
            className={'w-full lg:max-w-[24rem] mt-4 lg:mt-0'}
            type={'secondary'}
            onClick={handleSearchButtonByLocationClicked}
          >
            Buscar por mi ubicación actual
          </Button>
        </div>
      </MainContainer>
    </div>
  );
};

export default Search;
