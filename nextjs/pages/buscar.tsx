import React, { RefObject, useState } from 'react';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import { Pill } from '../components/Pill';
import servicesData from '../assets/services.json';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useRouter } from 'next/router';
import { Coordinates } from '../model/map';
import { GetStaticProps, NextPage } from 'next';

type StaticProps = {
  googleMapsApiKey: string;
};

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
  return {
    props: {
      googleMapsApiKey,
    },
  };
};

const Search: NextPage<StaticProps> = ({ googleMapsApiKey }) => {
  const router = useRouter();

  const { ref: autocompleteInputRef }: { ref: RefObject<HTMLInputElement> } = usePlacesWidget({
    apiKey: googleMapsApiKey,
    onPlaceSelected: (place) => {
      setLocation(place.formatted_address);
      setCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    },
    options: {
      componentRestrictions: { country: 'ar' },
      types: ['locality', 'street_address', 'sublocality', 'health', 'intersection'],
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
      ? servicesData.filter((service) => searchedServiceIds.includes(service.id))
      : servicesData;
  const services = searchedServices.map((service) => service);

  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<Coordinates>({ lat: -34.6989, lng: -64.7597 });
  const isLocationEmpty = location.trim() === '';

  const handleLocationChange = (event: React.FormEvent<HTMLInputElement>) => {
    setLocation(event.currentTarget.value);
  };

  const handleSearchButtonClicked = () => {
    if (!isLocationEmpty) {
      router.push({
        pathname: '/establecimientos',
        query: {
          coords: encodeURIComponent(JSON.stringify(coords)),
        },
      });
    }
  };

  const handleSearchButtonByLocationClicked = () => {
    router.push('/establecimientos');
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
          ref={autocompleteInputRef}
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
