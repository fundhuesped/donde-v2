import MainContainer from '../components/MainContainer';
import { BackButton } from '../components/BackButton';
import { Icon } from '../components/Icon';
import { Pill } from '../components/Pill';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../components/Card';
import { ClockIcon, LocationMarkerIcon, GlobeAltIcon } from '@heroicons/react/outline';
import { PhoneIcon, ShareIcon } from '@heroicons/react/solid';
import { ReactComponent as WhatsAppLogo } from '../assets/images/WhatsAppLogo.svg';

import React from 'react';
import { ReactComponent as TestDeVIH } from '../assets/images/TestDeVIH.svg';

interface WebSiteButtonProps {
  website: string;
}

const WebSiteButton = React.memo<WebSiteButtonProps>((props) => {
  const { website } = props;
  return (
    <a href={website} role="button">
      <Icon type="secondary" circle={true} icon={<GlobeAltIcon className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>Sitio Web</div>
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
      <Icon type="secondary" circle={true} icon={<PhoneIcon className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>Llamar</div>
    </a>
  );
});

interface WhatsAppButtonProps {
  phone: string;
}

const WhatsAppButton = React.memo<WhatsAppButtonProps>((props) => {
  const { phone } = props;
  return (
    // https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat
    <a href={'https://wa.me/' + phone} role="button">
      <Icon type="secondary" circle={true} icon={<WhatsAppLogo />} />
      <div className={'pt-2 text-center text-xs text-primary'}>WhatsApp</div>
    </a>
  );
});

const ShareButton = () => {
  return (
    <button>
      <Icon type="secondary" circle={true} icon={<ShareIcon className={'text-primary'} />} />
      <div className={'pt-2 text-center text-xs text-primary'}>Compartir</div>
    </button>
  );
};

export const Establishment = () => {
  const name = 'BIOLAB SRL';
  const type = 'Privado';
  const address = 'M. Moreno 449, Santa Rosa, La Pampa';
  const addressNotes = '';
  const businessHours = 'Lunes a viernes 7 a 11 Hs';
  const services = [{ id: 'test-hiv', name: 'Test de HIV', icon: <TestDeVIH /> }];
  const website = 'https://www.biolabsrl.com.ar';
  const phone = '02954814366';
  const whatsApp = '2954427081';
  const additionalInfo = 'Se necesitan 8 Hs de ayuno. El resultado es  ario.';

  return (
    <>
      <BackButton />
      <MainContainer>
        <header className={'mt-10 ml-4'}>
          <CardHeader className={'font-title text-lg'}>{name}</CardHeader>
          <CardParagraph>{type}</CardParagraph>
        </header>
        <Card className={'my-4 pb-6'}>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              {address} {addressNotes && <span className={'text-xs text-medium-gray'}>- {addressNotes}</span>}
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

          {additionalInfo && (
            <>
              <CardSubHeader>Otros datos</CardSubHeader>
              <CardParagraph>{additionalInfo}</CardParagraph>
            </>
          )}

          <footer className={'mt-4'}>
            <Pill>Cargado por Fundación Huesped</Pill>
          </footer>
        </Card>

        <div className={'flex justify-center space-x-7 my-9'}>
          {website && <WebSiteButton website={website} />}
          {phone && <PhoneButton phone={phone} />}
          <ShareButton />
          {whatsApp && <WhatsAppButton phone={whatsApp} />}
        </div>
      </MainContainer>
    </>
  );
};
