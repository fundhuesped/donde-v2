import React, {useState} from 'react';
import { LocationMarkerIcon, ClockIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import { Card, CardHeader, CardListItem, CardList } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';
import GoogleMapReact from 'google-map-react';
import { Marker } from '../components/Marker';
import MainContainer from '../components/MainContainer';
import {useLocation, useNavigate} from 'react-router-dom';
import places from '../assets/establecimientos.json'
import {BackButton} from "../components/BackButton";

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
  const navigate = useNavigate();

  const { state } = useLocation() as Location;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { location, coords } = state;

  const [activeMarker, setActiveMarker] = useState<any>(null);
  const handleMarkerClick = (marker:number) => {
    setActiveMarker(markers[marker-1])
  }

  const handleClose = () => {
    setActiveMarker(null)
  }

  const placeInfo = (data:string|number) => {
    if (typeof data === 'number') return data
    if (data.toLowerCase() === "null") return ''
    return data
  }

  const handleDetailsClick = () => {
    navigate('/establecimiento', { state: activeMarker });
  }

  return (
    <>
      <BackButton />
      <MainContainer className={'relative overflow-hidden px-0'}>
        <div className={classNames('w-full')} style={{ height: 'calc(100vh - 56px - 32px - 1.5rem)' }}>
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
            onChildClick={handleMarkerClick}
          >
            {markers.map((marker) => (
              <Marker {...marker} />
            ))}
          </GoogleMapReact>
        </div>

        {activeMarker !== null &&
            <Card onClick={handleDetailsClick} className={'fixed bottom-8 right-4 left-4'}>
              <header className={'flex flex-row justify-between items-center mb-2'}>
                <CardHeader>{activeMarker.establecimiento}</CardHeader>
                <span className={'w-5 text-dark-gray'}>
              <XIcon onClick={handleClose} />
            </span>
              </header>
              <CardList>
                <CardListItem icon={<LocationMarkerIcon className={'text-primary'}/>}>
                  {`${placeInfo(activeMarker.calle)} ${placeInfo(activeMarker.altura)}, ${placeInfo(activeMarker.nombre_ciudad)}`}
                  {/*<span className={'text-xs text-medium-gray'}>- A 400 metros</span>*/}
                </CardListItem>
                {activeMarker.horario_testeo.toLowerCase() !== 'null' && <CardListItem icon={<ClockIcon className={'text-primary'}/>}>{activeMarker.horario_testeo}</CardListItem> }
                <CardListItem icon={<SupportIcon className={'text-primary'}/>}>Test de HIV</CardListItem>
              </CardList>
              <footer className={classNames('mt-4')}>
                <Pill>Cargado por Fundación Huesped</Pill>
              </footer>
            </Card>
        }
      </MainContainer>
    </>
  );
};

export default Map;
