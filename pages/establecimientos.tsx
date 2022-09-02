import { LocationMarkerIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardList, CardListItem } from '../components/Card';
import MainContainer from '../components/MainContainer';
import { Marker, UserMarker } from '../components/Marker';
import { Pill } from '../components/Pill';
import { formatEstablishmentLocation } from '../utils/establishments';
import axios from 'axios';
import { Establishment } from '../model/establishment';
import useSWR from 'swr';
import { uniqBy } from 'lodash';
import { SERVICE_ICONS } from '../config/services';
import { ServiceIcon } from '../model/services';

const USER_MARKER_ID = 'USER_MARKER_ID';

type StaticProps = {
  googleMapsApiKey: string;
};
export const establishmentWithinBoundaries = (marker: Coordinates, bounds: Bounds) => {
  const northLat = bounds.nw.lat;
  const southLat = bounds.sw.lat;
  const westLng = bounds.nw.lng;
  const eastLng = bounds.ne.lng;
  return marker.lat < northLat && marker.lat > southLat && marker.lng > westLng && marker.lng < eastLng;
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

const defaultCoords = { lat: -34.6989, lng: -64.7597 };
const defaultZoom = 15;

export type Coordinates = { lat: number; lng: number };

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

const getMapPosition = (coords: Coordinates | undefined): MapPosition => {
  if (coords) {
    return { coords, zoom: defaultZoom };
  }

  return { coords: defaultCoords, zoom: defaultZoom };
};

const Establishments: NextPage<StaticProps> = ({ googleMapsApiKey }) => {
  const router = useRouter();

  const { coords: serializedCoords } = router.query;
  const coords = useMemo(
    () =>
      serializedCoords && typeof serializedCoords === 'string' ? JSON.parse(decodeURIComponent(serializedCoords)) : undefined,
    [serializedCoords],
  );

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);

  const servicesQueryParam = router.query.services;
  const searchedServiceIds = servicesQueryParam
    ? Array.isArray(servicesQueryParam)
      ? servicesQueryParam
      : [servicesQueryParam]
    : [];

  const { data: establishments } = useSWR(router.isReady ? '/api/establishments' : null, (url) =>
    axios.get(url, { params: { services: searchedServiceIds } }).then((res) => res.data),
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (coords) {
      // Sin el setTimeout no funciona el ruteo, no pudimos encontrar el motivo
      setTimeout(() => {
        setMapPosition(getMapPosition(coords));
      }, 0);
    } else {
      getCurrentLocation((coords) => setMapPosition(getMapPosition(coords)));
    }
  }, [router.isReady, coords]);

  const [bounds, setBounds] = useState<Bounds | null>(null);

  const [activeEstablishment, setActiveEstablishment] = useState<Establishment | null>(null);
  const handleMarkerClick = (establishmentId: string) => {
    if (establishmentId === USER_MARKER_ID) {
      return;
    }
    setActiveEstablishment(establishments.find((establishment: Establishment) => establishment.id === establishmentId) ?? null);
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveEstablishment(null);
  };

  const handleDetailsClick = () => {
    if (activeEstablishment) {
      router.push(`/establecimientos/${activeEstablishment.id}`);
    }
  };

  return (
    <>
      <Head>
        <title>Dónde - Establecimientos</title>
      </Head>

      <MainContainer className={'relative overflow-hidden px-0'}>
        {mapPosition && (
          <>
            <div className={classNames('w-full lg:mx-auto')} style={{ height: 'calc(100vh - 56px - 1.5rem)' }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: googleMapsApiKey,
                  language: 'es',
                  region: 'ar',
                }}
                options={{
                  fullscreenControl: false,
                  zoomControl: false,
                }}
                defaultCenter={mapPosition.coords}
                defaultZoom={mapPosition.zoom}
                onChildClick={handleMarkerClick}
                resetBoundsOnResize={true}
                onChange={({ bounds }) => {
                  setBounds(bounds);
                }}
              >
                <UserMarker key={USER_MARKER_ID} lat={mapPosition.coords.lat} lng={mapPosition.coords.lng} />

                {establishments &&
                  establishments
                    .filter(
                      (establishment: Establishment) =>
                        bounds !== null &&
                        establishmentWithinBoundaries(
                          {
                            lat: establishment.latitude,
                            lng: establishment.longitude,
                          },
                          bounds,
                        ),
                    )
                    .map((establishment: Establishment) => {
                      return <Marker lat={establishment.latitude} lng={establishment.longitude} key={establishment.id} />;
                    })}
              </GoogleMapReact>
            </div>

            {activeEstablishment !== null && (
              <Card
                onClick={handleDetailsClick}
                className={'fixed bottom-8 right-4 left-4 cursor-pointer lg:w-desktop lg:mx-auto'}
              >
                <header className={'flex flex-row justify-between items-center mb-2'}>
                  <CardHeader>{activeEstablishment.name}</CardHeader>
                  <button className={'w-5 text-dark-gray'} onClick={handleClose}>
                    <XIcon />
                  </button>
                </header>
                <CardList>
                  <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
                    {formatEstablishmentLocation(activeEstablishment)}
                    {/*<span className={'text-xs text-medium-gray'}>- A 400 metros</span>*/}
                  </CardListItem>
                  {uniqBy(
                    activeEstablishment.specialties.map((specialty) => specialty.specialty.service),
                    (service) => service.id,
                  ).map((service) => (
                    <CardListItem key={service.id} icon={SERVICE_ICONS[service.icon as ServiceIcon]}>
                      {service.name}
                    </CardListItem>
                  ))}
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

export default Establishments;
