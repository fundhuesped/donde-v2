import React from 'react';
import { LocationMarkerIcon, ClockIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import { Card, CardHeader, CardListItem, CardList } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';
import GoogleMapReact from 'google-map-react';
import { Marker } from '../components/Marker';
import MainContainer from '../components/MainContainer';

const markers = [
  {
    key: 1,
    lat: -34.602086,
    lng: -58.384543,
    address: 'Tribunales',
    schedule: 'Lunes a Viernes de 12 a 18',
  },
  {
    key: 2,
    lat: -34.592057,
    lng: -58.401208,
    address: 'Pueyrredon',
    schedule: 'Lunes a Viernes de 12 a 18',
  },
];

export type MapProps = {
  centerLat: number;
  centerLng: number;
  zoom?: number;
};

export const Map = React.memo<MapProps>((props) => {
  const { centerLat, centerLng, zoom = 14 } = props;
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
            center={{ lat: centerLat, lng: centerLng }}
            zoom={zoom}
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
});
