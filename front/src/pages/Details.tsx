import MainContainer from '../components/MainContainer';
import { BackButton } from '../components/BackButton';
import { Icon } from '../components/Icon';
import { Pill } from '../components/Pill';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../components/Card';
import { ClockIcon, LocationMarkerIcon, GlobeAltIcon, PhoneIcon, ShareIcon } from '@heroicons/react/outline';
import { ReactComponent as WhatsAppLogo } from '../assets/images/WhatsAppLogo.svg';

import React from 'react';
import { ReactComponent as Condones } from '../assets/images/Condones.svg';
import { ReactComponent as TestDeVIH } from '../assets/images/TestDeVIH.svg';


interface WebSiteButtonProps {
  website: string;
}

const WebSiteButton = React.memo<WebSiteButtonProps>((props) => {
  const { website } = props;
  return (
    <a href={website} role="button">
      <Icon type={'secondary'} circle={true} icon={<GlobeAltIcon className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>{'Sitio Web'}</div>
    </a>
  );
});

interface PhoneButtonProps {
  phone: string;
}

const PhoneButton = React.memo<PhoneButtonProps>((props) => {
  const { phone } = props;
  return (
    <a href={'tel:' + phone} role="button">
      <Icon type={'secondary'} circle={true} icon={<PhoneIcon className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>{'Llamar'}</div>
    </a>
  );
});
const handleClick = async () => {
  const shareData = {
    title: 'MDN',
    text: 'Learn web development on MDN!',
    url: 'https://developer.mozilla.org',
  };

  if (navigator['share']) {
    try {
      await navigator['share'](shareData);
      console.log('hola');
    } catch (err) {
      console.log('Error: ' + err);
    }
  }
};

const ShareButton = () => {
  return (
    <button onClick={handleClick}>
      <Icon type={'secondary'} circle={true} icon={<ShareIcon className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>{'Compartir'}</div>
    </button>
  );
};

interface WhatsAppButtonProps {
  phone: string;
}

const WhatsAppButton = React.memo<WhatsAppButtonProps>((props) => {
  const { phone } = props;
  return (
    // https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat
    <a href={'https://wa.me/' + phone} role="button">
      <Icon type={'secondary'} circle={true} icon={<WhatsAppLogo className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>{'WhatsApp'}</div>
    </a>
  );
});

export const Details = () => {
  const name = 'Nombre del establecimiento';
  const type = 'Tipo de establecimiento';
  const address = 'Calle 1234, CABA';
  const addressNotes = 'A 400 metros';
  const businessHours = 'Lunes a Sábados de 9 a 20 hs';
  const services = [
    { id: 'test-hiv', name: 'Test de HIV', icon: <TestDeVIH /> },
    { id: 'preservativos', name: 'Preservativos', icon: <Condones /> },
  ];
  return (
    <>
      <BackButton />
      <MainContainer>
        <div className={'mt-10 ml-4'}>
          <CardHeader className={'font-title text-lg'}>{name}</CardHeader>
          <CardParagraph>{type}</CardParagraph>
        </div>
        <Card className={'my-4'}>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              {address} <span className={'text-xs text-medium-gray'}>- {addressNotes}</span>
            </CardListItem>
            <CardListItem icon={<ClockIcon className={'text-primary'} />}>{businessHours}</CardListItem>
          </CardList>

          <CardSubHeader>Servicios disponibles</CardSubHeader>
          <CardList>
            {services.map((service) => {
              return (
                <CardListItem key={service.id} icon={service.icon}>
                  {service.name}
                </CardListItem>
              );
            })}
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

        <div className={'flex justify-center space-x-7 my-9'}>
          <WebSiteButton website={'//10pines.com'} />
          <PhoneButton phone={'541131213390'} />
          <ShareButton />
          <WhatsAppButton phone={'541131213390'} />
        </div>
      </MainContainer>
    </>
  );
};
