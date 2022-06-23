import React, { useState } from 'react';
import { ClockIcon, LocationMarkerIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import { Card, CardHeader, CardList, CardListItem } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';
import GoogleMapReact, { Coords } from 'google-map-react';
import { Marker } from '../components/Marker';
import MainContainer from '../components/MainContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import places from '../assets/establishments.json';

const markers = places.flatMap((place, index) => {
  // TODO: no se si es el mejor lugar para hacer esto
  if (typeof place.lat !== 'number' || typeof place.lng !== 'number') return [];
  return [
    {
      ...place,
      key: index,
      lat: place.lat,
      lng: place.lng,
    },
  ];
});

interface Location {
  state: {
    location?: string;
    coords?: {
      lat: number;
      lng: number;
    };
  };
}

const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!mapsApiKey) throw new Error('REACT_APP_GOOGLE_MAPS_API_KEY env var is not set');
const defaultCoords = { lat: -34.6989, lng: -64.7597 };
const defaultZoom = 14;

const Map = () => {
  const getCoordinates = (coords: { lat: number; lng: number } | undefined, location: string | undefined): [Coords, number] => {
    if (coords) {
      return [coords, defaultZoom];
    }
    if (location) {
      const place = markers.find((place) => location.toLowerCase().includes(place.nombre_partido.toLowerCase()));
      if (place) {
        const placeCoords = { lat: place.lat, lng: place.lng };
        return [placeCoords, 12];
      }
    }
    return [defaultCoords, 5];
  };

  const navigate = useNavigate();

  const { state } = useLocation() as Location;
  const { location, coords } = state;
  const [centerCoordinates, zoom] = getCoordinates(coords, location);

  const [activeMarker, setActiveMarker] = useState<any>(null);
  const handleMarkerClick = (marker: number) => {
    setActiveMarker(markers[marker - 1]);
  };

  const handleClose = () => {
    setActiveMarker(null);
  };

  const placeInfo = (data: string | number) => {
    if (typeof data === 'number') return data;
    if (data.toLowerCase() === 'null') return '';
    return data;
  };

  const handleDetailsClick = () => {
    navigate('/establecimiento', { state: activeMarker });
  };

  return (
    <>
      <MainContainer className={'relative overflow-hidden px-0'}>
        <div className={classNames('w-full')} style={{ height: 'calc(100vh - 56px - 32px - 1.5rem)' }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: mapsApiKey,
              language: 'es',
              region: 'ar',
            }}
            options={{
              fullscreenControl: false,
              zoomControl: false,
            }}
            center={centerCoordinates}
            zoom={zoom}
            onChildClick={handleMarkerClick}
          >
            {markers.map((marker) => (
              <Marker {...marker} />
            ))}
          </GoogleMapReact>
        </div>

        {activeMarker !== null && (
          <Card onClick={handleDetailsClick} className={'fixed bottom-8 right-4 left-4'}>
            <header className={'flex flex-row justify-between items-center mb-2'}>
              <CardHeader>{activeMarker.establecimiento}</CardHeader>
              <span className={'w-5 text-dark-gray'}>
                <XIcon onClick={handleClose} />
              </span>
            </header>
            <CardList>
              <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
                {`${placeInfo(activeMarker.calle)} ${placeInfo(activeMarker.altura)}, ${placeInfo(activeMarker.nombre_ciudad)}`}
                {/*<span className={'text-xs text-medium-gray'}>- A 400 metros</span>*/}
              </CardListItem>
              {activeMarker.horario_testeo.toLowerCase() !== 'null' && (
                <CardListItem icon={<ClockIcon className={'text-primary'} />}>{activeMarker.horario_testeo}</CardListItem>
              )}
              <CardListItem icon={<SupportIcon className={'text-primary'} />}>Test de HIV</CardListItem>
            </CardList>
            <footer className={classNames('mt-4')}>
              <Pill>Cargado por Fundación Huesped</Pill>
            </footer>
          </Card>
        )}
      </MainContainer>
    </>
  );
};

export default Map;
