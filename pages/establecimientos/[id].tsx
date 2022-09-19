import { GlobeAltIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import { PhoneIcon, ShareIcon } from '@heroicons/react/solid';
import _, { partition } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import WhatsAppLogo from '../../assets/images/WhatsAppLogo.svg';
import { BackButton } from '../../components/BackButton';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../../components/Card';
import { Icon } from '../../components/Icon';
import MainContainer from '../../components/MainContainer';
import { Pill } from '../../components/Pill';
import { SERVICE_ICONS } from '../../config/services';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { Establishment } from '../../model/establishment';
import { ServiceIcon } from '../../model/services';
import { getEstablishment } from '../../server/api/establishments';
import { formatEstablishmentLocation, formatEstablishmentType } from '../../utils/establishments';

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
  establishment: Establishment | undefined;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ query }) => {
  let establishment;
  try {
    establishment = await getEstablishment(query.id);
  } catch {
    establishment = undefined;
  }
  return {
    props: {
      establishment,
    },
  };
};

export const EstablishmentPage: NextPage<ServerSideProps> = React.memo(({ establishment }) => {
  const user = useAuthenticatedUser();

  if (!establishment) {
    return null;
  }

  const addressNotes = null;
  const whatsAppPhone = null;

  const { name, website, details: additionalInfo } = establishment;

  const address = formatEstablishmentLocation(establishment);
  const establishmentType = formatEstablishmentType(establishment);

  return (
    <>
      <Head>
        <title>Dónde - {name}</title>
      </Head>

      <div className="w-full p-5">
        <BackButton className="ml-2 lg:absolute lg:left-4" />
      </div>
      <MainContainer className={'lg:w-desktop lg:mx-auto relative'}>
        <header className={'mt-10 ml-4'}>
          <CardHeader className={'font-title text-lg'}>{name}</CardHeader>
          <CardParagraph>{establishmentType}</CardParagraph>
        </header>
        {user && (
          <Link href={`/establecimientos/editar/${establishment.id}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={'color-primary font-bold absolute top-8 right-8'}>Editar</a>
          </Link>
        )}
        <Card className={'my-4 pb-6'}>
          <CardList>
            <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
              {address} {addressNotes && <span className={'text-xs text-medium-gray'}>- {addressNotes}</span>}
            </CardListItem>
          </CardList>

          <CardSubHeader>Servicios disponibles</CardSubHeader>
          <CardList>
            {_(establishment.specialties)
              .groupBy(({ specialty }) => specialty.service.id)
              .values()
              .sortBy((specialties) => specialties[0]!.specialty.service.name)
              .map((specialties) => {
                const [[defaultSpecialty], [subSpecialty]] = partition(specialties, ({ specialty }) => specialty.name === null);
                const specialty = subSpecialty ?? defaultSpecialty;
                if (!specialty) {
                  return null;
                }
                const service = specialty.specialty.service;
                return (
                  <CardListItem key={service.id} icon={SERVICE_ICONS[service.icon as ServiceIcon]}>
                    {specialty.specialty.name ? (
                      <>
                        <span>{service.name}</span>
                        <span className={'text-medium-gray text-xs'}> - {specialty.specialty.name}</span>
                      </>
                    ) : (
                      service.name
                    )}
                  </CardListItem>
                );
              })
              .value()}
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

export default EstablishmentPage;
