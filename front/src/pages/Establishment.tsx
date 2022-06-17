import React from 'react';
import { LocationMarkerIcon, ClockIcon, SupportIcon, XIcon } from '@heroicons/react/outline';
import MainContainer from '../components/MainContainer';
import { Card, CardHeader, CardListItem, CardList, CardParagraph } from '../components/Card';
import classNames from 'classnames';
import { Pill } from '../components/Pill';

export const Establishment = React.memo(() => {
  return (
    <>
      <MainContainer className={'relative'}>
        <header className={'mt-10 mb-5 px-4'}>
          <h2 className={'text-xl text-black font-bold'}>Nombre del establicimiento</h2>
          <small className={'text-black text-sm'}>Tipo de establecimiento</small>
        </header>
        <Card className={''}>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              Calle 1234, CABA <span className={'text-xs text-medium-gray'}>- A 400 metros</span>
            </CardListItem>
            <CardListItem icon={<ClockIcon className={'text-primary'} />}>Lunes a Sábados de 9 a 20 hs</CardListItem>
            <CardListItem icon={<SupportIcon className={'text-primary'} />}>Test de HIV</CardListItem>
          </CardList>
          <h4 className={'text-xs text-medium-gray mb-2 mt-5'}>Otros datos</h4>
          <CardParagraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.
          </CardParagraph>
          <footer className={classNames('mt-4')}>
            <Pill>Cargado por Fundación Huesped</Pill>
          </footer>
        </Card>
      </MainContainer>
    </>
  );
});
