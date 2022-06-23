import React, { useEffect, useState } from 'react';
import { ClockIcon, LocationMarkerIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import { Card, CardHeader, CardList, CardListItem } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';
import GoogleMapReact from 'google-map-react';
import { Marker } from '../components/Marker';
import MainContainer from '../components/MainContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import places from '../assets/establishments.json';
import { formatEstablishmentLocation } from '../utils/establishments';

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

type LocationState = null | {
  location?: string;
  coords?: {
    lat: number;
    lng: number;
  };
};

const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!mapsApiKey) throw new Error('REACT_APP_GOOGLE_MAPS_API_KEY env var is not set');
const defaultCoords = { lat: -34.6989, lng: -64.7597 };
const defaultZoom = 14;

type Coordinates = { lat: number; lng: number };

function getCurrentLocation(callback: (coords: Coordinates) => void): void {
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      const { coords } = position;
      const { latitude: lat, longitude: lng } = coords;
      callback({ lat, lng });
    },
    (error: GeolocationPositionError) => console.warn('ERROR(' + error.code + '): ' + error.message),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
}

type MapPosition = {
  coords: Coordinates;
  zoom: number;
};

const getMapPosition = (coords: Coordinates | undefined, location: string | undefined): MapPosition => {
  if (coords) {
    return { coords, zoom: defaultZoom };
  }
  if (location) {
    const place = markers.find((place) => location.toLowerCase().includes(place.nombre_partido.toLowerCase()));
    if (place) {
      const placeCoords = { lat: place.lat, lng: place.lng };
      return { coords: placeCoords, zoom: 12 };
    }
  }
  return { coords: defaultCoords, zoom: 5 };
};

const Map = () => {
  const navigate = useNavigate();

  const { location, coords } = (useLocation().state as LocationState) ?? {};
  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  useEffect(() => {
    if (location || coords) {
      setMapPosition(getMapPosition(coords, location));
    } else {
      getCurrentLocation((coords) => setMapPosition(getMapPosition(coords, undefined)));
    }
  }, [location, coords]);

  const [activeMarker, setActiveMarker] = useState<any>(null);
  const handleMarkerClick = (marker: number) => {
    setActiveMarker(markers[marker - 1]);
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveMarker(null);
  };

  const handleDetailsClick = () => {
    navigate(`/establecimientos/${activeMarker.placeId}`);
  };

  return (
    <>
      <MainContainer className={'relative overflow-hidden px-0'}>
        {mapPosition && (
          <>
            <div className={classNames('w-full')} style={{ height: 'calc(100vh - 56px - 1.5rem)' }}>
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
                center={mapPosition.coords}
                zoom={mapPosition.zoom}
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
                  <button className={'w-5 text-dark-gray'} onClick={handleClose}>
                  <XIcon />
              </button>
                </header>
                <CardList>
                  <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
                    {formatEstablishmentLocation(activeMarker)}
                    {/*<span className={'text-xs text-medium-gray'}>- A 400 metros</span>*/}
                  </CardListItem>
                  {activeMarker.horario_testeo !== null && (
                    <CardListItem icon={<ClockIcon className={'text-primary'} />}>{activeMarker.horario_testeo}</CardListItem>
                  )}
                  <CardListItem icon={<SupportIcon className={'text-primary'} />}>Test de HIV</CardListItem>
                </CardList>
                <footer className={classNames('mt-4')}>
                  <Pill>Cargado por Fundación Huesped</Pill>
                </footer>
              </Card>
            )}
          </>
        )}
      </MainContainer>
    </>
  );
};

export default Map;
