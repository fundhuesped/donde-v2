import { Icon } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../../components/Card';
import { ClockIcon, GlobeAltIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import { PhoneIcon, ShareIcon } from '@heroicons/react/solid';
import WhatsAppLogo from '../../assets/images/WhatsAppLogo.svg';
import React from 'react';
import places from '../../assets/establishments.json';
import services from '../../assets/services.json';
import { formatEstablishmentLocation } from '../../utils/establishments';
import { SERVICE_ICONS } from '../../config/services';
import MainContainer from '../../components/MainContainer';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Service } from '../../model/services';
import Head from 'next/head';

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
  const supportsSharing = !!navigator.share;
  const shareEstablishment = () => {
    const title = `${name} | Dónde`;
    const url = window.location.href;
    // Share using Web Share API if available. Otherwise, copy to clipboard.
    if (supportsSharing) {
      navigator.share({ url, title }).catch((e) => console.error(e));
    } else {
      // TODO: Add toast indicating that the establishment info was copied to the clipboard.
      navigator.clipboard.writeText(`${title}\n${url}`).catch((e) => console.error(e));
    }
  };
  return (
    <button onClick={shareEstablishment}>
      <Icon
        type="secondary"
        circle={true}
        icon={<ShareIcon className={'text-primary'} />}
        label={supportsSharing ? 'Compartir' : 'Copiar'}
      />
    </button>
  );
};

export const Establishment: NextPage = React.memo(() => {
  const router = useRouter();
  const { id: idParam } = router.query;
  const id = idParam && typeof idParam === 'string' ? parseInt(idParam) : undefined;
  const establishment = places.find((place) => place.placeId === id);

  if (!establishment) {
    return null;
  }

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
      <Head>
        <title>Dónde - {name}</title>
      </Head>

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
            {services.map((service: Service) => {
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

export default Establishment;