import MainContainer from '../components/MainContainer';
import { BackButton } from '../components/BackButton';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../components/Card';
import { ClockIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import { Pill } from '../components/Pill';
import React from 'react';

import { ReactComponent as TestDeVIH } from '../assets/images/TestDeVIH.svg';
import { ReactComponent as Condones } from '../assets/images/Condones.svg';

export const Details = () => {
  return (
    <>
      <BackButton />
      <MainContainer>
        <div className={'mt-10 ml-4'}>
          <CardHeader className={'font-title text-lg'}>Nombre del establecimiento</CardHeader>
          <CardParagraph>Tipo de establecimiento</CardParagraph>
        </div>
        <Card className={'mt-4'}>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              Calle 1234, CABA <span className={'text-xs text-medium-gray'}>- A 400 metros</span>
            </CardListItem>
            <CardListItem icon={<ClockIcon className={'text-primary'} />}>Lunes a Sábados de 9 a 20 hs</CardListItem>
          </CardList>

          <CardSubHeader>Servicios disponibles</CardSubHeader>
          <CardList>
            <CardListItem icon={<TestDeVIH />}>Test de HIV</CardListItem>
            <CardListItem icon={<Condones />}>Preservativos</CardListItem>
          </CardList>

          <CardSubHeader>Otros datos</CardSubHeader>
          <CardParagraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.
          </CardParagraph>

          <footer className={'mt-4'}>
            <Pill>Cargado por Fundación Huesped</Pill>
          </footer>
        </Card>
      </MainContainer>
    </>
  );
};
