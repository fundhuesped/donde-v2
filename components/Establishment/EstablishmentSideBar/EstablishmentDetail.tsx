import { GlobeAltIcon, LocationMarkerIcon, PhoneIcon, ShareIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { partition } from 'lodash';
import Link from 'next/link';
import React from 'react';
import WhatsAppLogo from '../../../assets/images/WhatsAppLogo.svg';
import { SERVICE_ICONS } from '../../../config/services';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { Establishment } from '../../../model/establishment';
import { ServiceIcon } from '../../../model/services';
import { formatEstablishmentLocation, formatEstablishmentType } from '../../../utils/establishments';
import { Card, CardHeader, CardList, CardListItem, CardParagraph, CardSubHeader } from '../../Card';
import { Icon } from '../../Icon';
import { Pill } from '../../Pill';

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

type Props = React.PropsWithChildren<{
  establishment: Establishment;
  setActiveEstablishment: Dispatch<SetStateAction<string>>;
}>;

export const EstablishmentDetail = React.memo<Props>((props) => {
  const { establishment, setActiveEstablishment } = props;

  const user = useAuthenticatedUser();

  if (!establishment) {
    return null;
  }

  const addressNotes = null;
  const whatsAppPhone = null;

  const { id, name, website, details: additionalInfo } = establishment;

  const address = formatEstablishmentLocation(establishment);
  const establishmentType = formatEstablishmentType(establishment);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveEstablishment(null);
  };

  return (
    <Card key={id} className={'fixed top-8 right-4 left-4 cursor-pointer lg:w-1/4 lg:mx-auto'}>
      <header className={'flex flex-row justify-between items-center mb-2'}>
        <CardHeader>{name}</CardHeader>
        <CardParagraph>{establishmentType}</CardParagraph>

        <button className={'w-5 text-dark-gray'} onClick={handleClose}>
          <XIcon />
        </button>
      </header>
      {user && (
        <Link href={`/establecimientos/editar/${establishment.id}`}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className={'color-primary font-bold absolute top-8 right-8'}>Editar</a>
        </Link>
      )}
      <CardList>
        <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
          {address} {addressNotes && <span className={'text-xs text-medium-gray'}>- {addressNotes}</span>}
        </CardListItem>
        {/*<span className={'text-xs text-medium-gray'}>- A 400 metros</span>*/}
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
      </CardList>
      <footer className={classNames('mt-4')}>
        {additionalInfo && (
          <>
            <CardSubHeader>Otros datos</CardSubHeader>
            <CardParagraph>{additionalInfo}</CardParagraph>
          </>
        )}

        <Pill>Cargado por Fundación Huesped</Pill>
      </footer>

      <div className={'flex justify-center space-x-7 my-9'}>
        {website && <WebSiteButton website={website} />}
        <ShareButton name={name} />
        {whatsAppPhone && <WhatsAppButton phone={whatsAppPhone} />}
      </div>
    </Card>
  );
});
