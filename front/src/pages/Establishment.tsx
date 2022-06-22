import MainContainer from '../components/MainContainer';
import { BackButton } from '../components/BackButton';
import { Icon } from '../components/Icon';
import { Pill } from '../components/Pill';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../components/Card';
import { ClockIcon, LocationMarkerIcon, GlobeAltIcon } from '@heroicons/react/outline';
import { PhoneIcon, ShareIcon } from '@heroicons/react/solid';
import { ReactComponent as WhatsAppLogo } from '../assets/images/WhatsAppLogo.svg';
import React, { ReactNode } from 'react';

interface WebSiteButtonProps {
  website: string;
}

const WebSiteButton = React.memo<WebSiteButtonProps>((props) => {
  const { website } = props;
  return (
    <a href={website} role="button">
      <Icon type="secondary" circle={true} icon={<GlobeAltIcon className={'text-primary'} />} label={'Sitio Web'} />
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
      <Icon type="secondary" circle={true} icon={<PhoneIcon className={'text-primary'} />} label={'Llamar'} />
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
      <Icon type="secondary" circle={true} icon={<WhatsAppLogo />} label={'WhatsApp'} />
    </a>
  );
});

const ShareButton = () => {
  return (
    <button>
      <Icon type="secondary" circle={true} icon={<ShareIcon className={'text-primary'} />} label={'Compartir'} />
    </button>
  );
};

interface Service {
  id: string;
  name: string;
  icon: ReactNode;
}

interface EstablishmentProps {
  name: string;
  type: string;
  address: string;
  addressNotes?: string;
  businessHours: string;
  services: Service[];
  website?: string;
  phone?: string;
  whatsAppPhone?: string;
  additionalInfo?: string;
}

export const Establishment = React.memo<EstablishmentProps>((props) => {
  const { name, type, address, addressNotes, businessHours, services, website, phone, whatsAppPhone, additionalInfo } = props;

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
          {whatsAppPhone && <WhatsAppButton phone={whatsAppPhone} />}
        </div>
      </MainContainer>
    </>
  );
});
