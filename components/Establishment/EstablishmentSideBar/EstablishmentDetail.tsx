import { GlobeAltIcon, PhoneIcon, ShareIcon, XIcon } from '@heroicons/react/outline';
import { UserRole } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import WhatsAppLogo from '../../../assets/images/WhatsAppLogo.svg';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { Establishment } from '../../../model/establishment';
import { formatEstablishmentType } from '../../../utils/establishments';
import { Card, CardHeader, CardParagraph, CardSubHeader } from '../../Card';
import { Icon } from '../../Icon';
import { Pill } from '../../Pill';
import EstablishmentTab from '../EstablishmentTab';

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
  activeEstablishment: Establishment;
  setActiveEstablishment: (value: Establishment | null) => void;
  className: string;
}>;

export const EstablishmentDetail = React.memo<Props>((props) => {
  const { activeEstablishment, className, setActiveEstablishment } = props;

  const router = useRouter();

  const user = useAuthenticatedUser();

  if (!activeEstablishment) {
    return null;
  }

  const whatsAppPhone = null;

  const { id, name, website, details: additionalInfo } = activeEstablishment;

  const establishmentType = formatEstablishmentType(activeEstablishment);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveEstablishment(null);
  };

  const handleDetailsClick = (id: string) => {
    router.push(`/establecimientos/${id}`);
  };

  return (
    <Card key={id} className={`${className} fixed lg:block top-16 lg:top-8 right-4 left-4 lg:left-1/3 lg:w-1/3`}>
      <header className={'flex flex-row justify-between items-center mb-2'}>
        <CardHeader className="pt-2">
          {name}
          <CardParagraph className="font-light">{establishmentType}</CardParagraph>
        </CardHeader>
        {user?.role === UserRole.ADMIN && (
          <Link href={`/establecimientos/editar/${activeEstablishment.id}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={'color-primary font-bold absolute top-8 right-12'}>Editar</a>
          </Link>
        )}
        <button className={'w-5 text-dark-gray mr-1 pb-4'} onClick={handleClose}>
          <XIcon />
        </button>
      </header>
      <EstablishmentTab activeEstablishment={activeEstablishment} />
      <footer className={classNames('mt-4 flex justify-center')}>
        {additionalInfo && (
          <>
            <CardSubHeader>Otros datos</CardSubHeader>
            <CardParagraph>{additionalInfo}</CardParagraph>
          </>
        )}

        <Pill onClick={() => handleDetailsClick(activeEstablishment.id)} className={'cursor-pointer'}>
          Cargado por Fundación Huesped
        </Pill>
      </footer>

      <div className={'flex justify-center space-x-7 my-3'}>
        {website && <WebSiteButton website={website} />}
        <ShareButton name={name} />
        {whatsAppPhone && <WhatsAppButton phone={whatsAppPhone} />}
      </div>
    </Card>
  );
});
