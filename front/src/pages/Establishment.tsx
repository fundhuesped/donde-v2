import MainContainer from '../components/MainContainer';
import { Icon } from '../components/Icon';
import { Pill } from '../components/Pill';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../components/Card';
import { ClockIcon, GlobeAltIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import { PhoneIcon, ShareIcon } from '@heroicons/react/solid';
import { ReactComponent as WhatsAppLogo } from '../assets/images/WhatsAppLogo.svg';
import React from 'react';
import { useParams } from 'react-router-dom';
import places from '../assets/establishments.json';
import services from '../assets/services.json';
import { formatEstablishmentLocation } from '../utils/establishments';
import { SERVICE_ICONS } from '../config/services';

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

const ShareButton = (props: { name: string }) => {
  const { name } = props;
  const shareEstablishment = () => {
    const title = `${name} | Dónde`;
    const url = window.location.href;
    // Share using Web Share API if available. Otherwise, copy to clipboard.
    if (navigator.share) {
      navigator.share({ url, title }).catch((e) => console.error(e));
    } else {
      // TODO: Add toast indicating that the establishment info was copied to the clipboard.
      navigator.clipboard.writeText(`${title}\n${url}`).catch((e) => console.error(e));
    }
  };
  return (
    <button onClick={shareEstablishment}>
      <Icon type="secondary" circle={true} icon={<ShareIcon className={'text-primary'} />} label={'Compartir'} />
    </button>
  );
};

export const Establishment = React.memo(() => {
  const { id: idParam } = useParams();
  const id = idParam ? parseInt(idParam) : undefined;
  const establishment = places.find((place) => place.placeId === id);

  if (!establishment) {
    return null;
  }
  console.log(establishment);

  const addressNotes = null;
  const whatsAppPhone = null;

  const {
    establecimiento: name,
    tipo: type,
    horario_testeo: businessHours,
    web_testeo: website,
    tel_testeo: phone,
    observaciones_testeo: additionalInfo,
  } = establishment;

  const address = formatEstablishmentLocation(establishment);

  return (
    <>
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
            {businessHours && <CardListItem icon={<ClockIcon className={'text-primary'} />}>{businessHours}</CardListItem>}
          </CardList>

          <CardSubHeader>Servicios disponibles</CardSubHeader>
          <CardList>
            {services.map((service) => {
              return (
                <CardListItem key={service.id} icon={SERVICE_ICONS[service.id]}>
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
          <ShareButton name={name} />
          {whatsAppPhone && <WhatsAppButton phone={whatsAppPhone} />}
        </div>
      </MainContainer>
    </>
  );
});
