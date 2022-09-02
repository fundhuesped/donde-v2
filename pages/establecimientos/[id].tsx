import { GlobeAltIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import { ExclamationIcon, PhoneIcon, ShareIcon } from '@heroicons/react/solid';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import WhatsAppLogo from '../../assets/images/WhatsAppLogo.svg';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../../components/Card';
import { Icon } from '../../components/Icon';
import MainContainer from '../../components/MainContainer';
import { Pill } from '../../components/Pill';
import { Service } from '../../model/services';
import { formatEstablishmentLocation } from '../../utils/establishments';
import { Establishment as EstablishmentModel } from '../../model/establishment';
import { getEstablishment } from '../../server/api/establishments';
interface WebSiteButtonProps {
  website: string;
}

const WebSiteButton = React.memo<WebSiteButtonProps>((props) => {
  const { website } = props;
  return (
    <a href={website} role="button">
      <Icon
        type="secondary"
        circle={true}
        className={'bg-white'}
        icon={<GlobeAltIcon className={'text-primary'} />}
        label={'Sitio Web'}
      />
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
      <Icon
        type="secondary"
        circle={true}
        className={'bg-white'}
        icon={<PhoneIcon className={'text-primary'} />}
        label={'Llamar'}
      />
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
      <Icon type="secondary" circle={true} className={'bg-white'} icon={<WhatsAppLogo />} label={'WhatsApp'} />
    </a>
  );
});

const ShareButton = (props: { name: string }) => {
  const { name } = props;
  const supportsSharing = typeof navigator !== 'undefined' && !!navigator.share;
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
        className={'bg-white'}
        icon={<ShareIcon className={'text-primary'} />}
        label={supportsSharing ? 'Compartir' : 'Copiar'}
      />
    </button>
  );
};

type ServerSideProps = {
  establishment: EstablishmentModel | undefined;
  services: Service[] | undefined;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ query }) => {
  let establishment;
  try {
    establishment = await getEstablishment(query.id);
  } catch {
    establishment = undefined;
  }
  const services = establishment?.specialties.map((specialty) => specialty.specialty.service);
  return {
    props: {
      establishment,
      services,
    },
  };
};

export const Establishment: NextPage<ServerSideProps> = React.memo(({ establishment, services }) => {
  if (!establishment) {
    return null;
  }

  const addressNotes = null;
  const whatsAppPhone = null;

  const { name, type, website, details: additionalInfo } = establishment;

  const address = formatEstablishmentLocation(establishment);

  return (
    <>
      <Head>
        <title>Dónde - {name}</title>
      </Head>

      <MainContainer className={'lg:w-desktop lg:mx-auto'}>
        <header className={'mt-10 ml-4'}>
          <CardHeader className={'font-title text-lg'}>{name}</CardHeader>
          <CardParagraph>{type}</CardParagraph>
        </header>
        <Card className={'my-4 pb-6'}>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              {address} {addressNotes && <span className={'text-xs text-medium-gray'}>- {addressNotes}</span>}
            </CardListItem>
          </CardList>

          <CardSubHeader>Servicios disponibles</CardSubHeader>
          <CardList>
            {services?.map((service: Service) => {
              return (
                <CardListItem key={service.id} icon={<ExclamationIcon />}>
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
          <ShareButton name={name} />
          {whatsAppPhone && <WhatsAppButton phone={whatsAppPhone} />}
        </div>
      </MainContainer>
    </>
  );
});

export default Establishment;
