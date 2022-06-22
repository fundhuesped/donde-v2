import React from 'react';
import { LocationMarkerIcon, ClockIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import { Card, CardHeader, CardListItem, CardList } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';
import GoogleMapReact from 'google-map-react';
import { Marker } from '../components/Marker';
import MainContainer from '../components/MainContainer';
import { useLocation } from 'react-router-dom';
import places from '../assets/establecimientos.json'

const markers = places.flatMap((place, index) => { // TODO: no se si es el mejor lugar para hacer esto
  if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number') return []
  return [{
    key: index,
    lat: place.latitude,
    lng: place.longitude,
    ...place
  }]
})

interface Location {
  state: {
    location?: string;
    coords?: {
      lat: number;
      lng: number;
    };
  };
}

const Map = () => {
  const { state } = useLocation() as Location;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { location, coords } = state;

  return (
    <>
      <MainContainer className={'relative overflow-hidden px-0'}>
        <div className={classNames('w-full')} style={{ height: 'calc(100vh - 56px - 1.5rem)' }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: '',
              language: 'es',
              region: 'ar',
            }}
            options={{
              fullscreenControl: false,
              zoomControl: false,
            }}
            center={ coords }
            zoom={ 14 }
          >
            {markers.map((marker) => (
              <Marker {...marker} />
            ))}
          </GoogleMapReact>
        </div>

        <Card className={'fixed bottom-8 right-4 left-4'}>
          <header className={'flex flex-row justify-between items-center mb-2'}>
            <CardHeader>Nombre del establecimiento</CardHeader>
            <span className={'w-5 text-dark-gray'}>
              <XIcon />
            </span>
          </header>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              Calle 1234, CABA <span className={'text-xs text-medium-gray'}>- A 400 metros</span>
            </CardListItem>
            <CardListItem icon={<ClockIcon className={'text-primary'} />}>Lunes a Sábados de 9 a 20 hs</CardListItem>
            <CardListItem icon={<SupportIcon className={'text-primary'} />}>Test de HIV</CardListItem>
          </CardList>
          <footer className={classNames('mt-4')}>
            <Pill>Cargado por Fundación Huesped</Pill>
          </footer>
        </Card>
      </MainContainer>
    </>
  );
};

export default Map;
