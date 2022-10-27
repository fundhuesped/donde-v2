import axios from 'axios';
import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import EstablishmentSideBar from '../components/Establishment/EstablishmentSideBar';
import { EstablishmentDetail } from '../components/Establishment/EstablishmentSideBar/EstablishmentDetail';
import EstablishmentHeader from '../components/Establishment/EstablishmentSideBar/EstablishmentHeader';
import EstablishmentList from '../components/Establishment/EstablishmentSideBar/EstablishmentList';
import EstablishmentToggle from '../components/Establishment/EstablishmentSideBar/EstablishmentToggle';
import MainContainer from '../components/MainContainer';
import { Marker, UserMarker } from '../components/Marker';
import { Establishment } from '../model/establishment';
import { prismaClient } from '../server/prisma/client';

const USER_MARKER_ID = 'USER_MARKER_ID';

type AvailableService = {
  id: string;
  name: string;
  icon: string;
};

type ServerSideProps = {
  googleMapsApiKey: string;
  availableServices: AvailableService[];
};

export const establishmentWithinBoundaries = (marker: Coordinates, bounds: Bounds) => {
  const northLat = bounds.nw.lat;
  const southLat = bounds.sw.lat;
  const westLng = bounds.nw.lng;
  const eastLng = bounds.ne.lng;
  return marker.lat < northLat && marker.lat > southLat && marker.lng > westLng && marker.lng < eastLng;
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
      googleMapsApiKey,
      availableServices: services,
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

const Establishments: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableServices }) => {
  const router = useRouter();

  const { coords: serializedCoords } = router.query;
  const coords = useMemo(
    () =>
      serializedCoords && typeof serializedCoords === 'string' ? JSON.parse(decodeURIComponent(serializedCoords)) : undefined,
    [serializedCoords],
  );

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [mapVisibility, setMapVisibility] = useState('block');

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

  useEffect(() => {
    setMapVisibility('block');
  }, []);

  const searchedServices =
    searchedServiceIds && searchedServiceIds.length !== 0
      ? availableServices.filter((service) => searchedServiceIds.includes(service.id))
      : availableServices;
  const services = searchedServices.map((service) => service);

  const establishmentInScreen =
    establishments &&
    establishments.filter(
      (establishment: Establishment) =>
        bounds !== null &&
        establishmentWithinBoundaries(
          {
            lat: establishment.latitude,
            lng: establishment.longitude,
          },
          bounds,
        ),
    );

  return (
    <div className='overflow-hidden lg:overflow-visible'>
      <Head>
        <title>Dónde - Establecimientos</title>
      </Head>

      <MainContainer className={'relative px-0 lg:map-desktop-height map-mobile-height'}>
        {mapPosition && (
          <div className={'flex'}>
            <div className={'absolute lg:relative w-full lg:w-1/3'}>
              <EstablishmentSideBar>
                <div className='h-[calc(100vh_-_64px)] lg:h-[calc(100vh_-_124px)] scroll-style overflow-auto lg:overflow-hidden'>
                  <EstablishmentHeader services={services}>
                  </EstablishmentHeader>
                  <EstablishmentToggle setMapVisibility={setMapVisibility} mapVisibility={mapVisibility} />
                  <EstablishmentList
                    establishments={establishmentInScreen}
                    setMapVisibility={setMapVisibility}
                    mapVisibility={mapVisibility}
                    setActiveEstablishment={setActiveEstablishment}
                  />
                </div>
              </EstablishmentSideBar>
            </div>

            {/* <div className={classNames(`${mapVisibility} lg:block lg:w-2/3 lg:mx-auto h-4/6 lg:h-screen`)}> */}
            <div className={classNames(`${mapVisibility} lg:block w-full lg:map-desktop-height map-mobile-height lg:mx-auto`)}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: googleMapsApiKey,
                  language: 'es',
                  region: 'ar',
                }}
                options={{
                  fullscreenControl: false,
                  zoomControl: false,
                  draggableCursor: 'default',
                }}
                defaultCenter={mapPosition.coords}
                defaultZoom={mapPosition.zoom}
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
                      return (
                        <Marker
                          key={establishment.id}
                          lat={establishment.latitude}
                          lng={establishment.longitude}
                          onClick={() => handleMarkerClick(establishment.id)}
                        />
                      );
                    })}
              </GoogleMapReact>
              {activeEstablishment !== null && (
                <EstablishmentDetail
                  activeEstablishment={activeEstablishment}
                  setActiveEstablishment={setActiveEstablishment}
                  className={mapVisibility}
                />
              )}
            </div>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default Establishments;
