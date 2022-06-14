import React from 'react';
import { LocationMarkerIcon, ClockIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import MainContainer from '../components/MainContainer';
import { Card, CardHeader, CardListItem, CardList } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';

export const Map = React.memo(() => {
  return (
    <>
      <MainContainer className={'relative'}>
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
