import { LocationMarkerIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { RefObject, useEffect, useState } from 'react';
import places from '../assets/establishments.json';
import servicesData from '../assets/services.json';
import { Button } from '../components/Button';
import { Card, CardHeader, CardList, CardListItem } from '../components/Card';
import EstablishmentSearchSidebar from '../components/Establishment/EstablishmentSearchSidebar';
import MainContainer from '../components/MainContainer';
import { Marker, UserMarker } from '../components/Marker';
import { Pill } from '../components/Pill';
import { formatEstablishmentLocation } from '../utils/establishments';

import isEmpty from 'lodash/isEmpty';
import { usePlacesWidget } from 'react-google-autocomplete';

type StaticProps = {
  googleMapsApiKey: string;
};
export const markerWithinBoundaries = (marker: Coordinates, bounds: Bounds) => {
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

function isValidMarkerValue(marker: number) {
  return marker >= 0;
}

const SearchEstablishmentDesktop: NextPage<StaticProps> = ({ googleMapsApiKey }) => {
  const router = useRouter();

  const { coords: serializedCoords } = router.query;
  const coords =
    serializedCoords && typeof serializedCoords === 'string' ? JSON.parse(decodeURIComponent(serializedCoords)) : undefined;

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);

  // *******************************

  const [searchLocation, setSearchLocation] = useState('');
  const [location, setLocation] = useState('');
  const [coordenates, setCoordenates] = useState<Coordinates>({} as Coordinates);
  const [isMissingSearchInfo, setIsMissingSearchInfo] = useState(true);

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

  const [activeMarker, setActiveMarker] = useState<any>(null);
  const handleMarkerClick = (marker: number) => {
    const markerValue = marker - 1;

    if (isValidMarkerValue(markerValue)) {
      setActiveMarker(markers[markerValue]);
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveMarker(null);
  };

  const handleDetailsClick = () => {
    router.push(`/establecimientos/${activeMarker.placeId}`);
  };

  const establishments = markers.filter((marker) => bounds !== null && markerWithinBoundaries(marker, bounds));

  // *******************************

  const { ref: autocompleteInputRef }: { ref: RefObject<HTMLInputElement> } = usePlacesWidget({
    apiKey: googleMapsApiKey,
    onPlaceSelected: (place) => {
      setSearchLocation(place.formatted_address);
      setLocation(place.formatted_address);
      setCoordenates({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
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
      ? servicesData.filter((service) => searchedServiceIds.includes(service.id))
      : servicesData;
  const services = searchedServices.map((service) => service);

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
        },
      });
    }
  };

  const handleSearchButtonByLocationClicked = () => {
    router.push('/establecimientos');
  };

  return (
    <>
      <Head>
        <title>Dónde - Establecimientos</title>
      </Head>

      <MainContainer className={'relative overflow-hidden px-0 '}>
        {mapPosition && (
          <div className={'flex'}>
            <div className={'lg:w-1/3'}>
              <EstablishmentSearchSidebar services={services}>
                <input
                  ref={autocompleteInputRef}
                  className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-4'}
                  placeholder={'Ingresá la ubicación'}
                  value={searchLocation}
                  onChange={handleSearchLocationChange}
                />
                <div className={'mt-8'}>
                  <Button
                    className={'bg-white w-full max-h-12'}
                    disabled={isMissingSearchInfo}
                    type={'primary'}
                    onClick={handleSearchButtonClicked}
                  >
                    Buscar
                  </Button>
                  <Button className={'w-full mt-4 max-h-12'} type={'secondary'} onClick={handleSearchButtonByLocationClicked}>
                    Buscar por mi ubicación actual
                  </Button>
                </div>
              </EstablishmentSearchSidebar>
            </div>

            <div className={classNames('w-full lg:w-2/3 lg:mx-auto ')} style={{ height: 'calc(100vh - 56px - 1.5rem)' }}>
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
                <UserMarker key={-1} lat={mapPosition.coords.lat} lng={mapPosition.coords.lng} />

                {markers
                  .filter((marker) => bounds !== null && markerWithinBoundaries(marker, bounds))
                  .map((marker) => {
                    return <Marker {...marker} key={marker.key} />;
                  })}
              </GoogleMapReact>
            </div>

            {activeMarker !== null && (
              <Card
                onClick={handleDetailsClick}
                className={'fixed bottom-8 right-4 left-4 cursor-pointer lg:w-desktop lg:mx-auto'}
              >
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
                  <CardListItem icon={<SupportIcon className={'text-primary'} />}>Test de HIV</CardListItem>
                </CardList>
                <footer className={classNames('mt-4')}>
                  <Pill>Cargado por Fundación Huesped</Pill>
                </footer>
              </Card>
            )}
          </div>
        )}
      </MainContainer>
    </>
  );
};

export default SearchEstablishmentDesktop;
