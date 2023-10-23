import { ViewGridIcon } from '@heroicons/react/outline';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect } from 'react';
import { Button } from '../components/Buttons/Button';
import MainContainer from '../components/MainContainer';
import { SERVICE_ICONS } from '../config/services';
import { Service, serviceSchema } from '../model/services';
import { prismaClient } from '../server/prisma/client';
import Popup from '../components/Popup/Popup';

type ServicePill = {
  id: string;
  name: string;
  icon: ReactNode;
  selected: boolean;
};

interface SearchButtonProps {
  enabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SearchButton = React.memo<SearchButtonProps>((props: SearchButtonProps) => {
  const { enabled, onClick } = props;

  return (
    <Button className={'my-5 w-full lg:w-80 lg:mr-1 mb-5 lg:my-5'} disabled={!enabled} type={'primary'} onClick={onClick}>
      Buscar
    </Button>
  );
});

type ServerSideProps = {
  availableServices: Service[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const services = await prismaClient.service.findMany({
    include: {
      subservices: true,
    },
  });
  return {
    props: {
      availableServices: services.map((service) => serviceSchema.validateSync(service)),
    },
  };
};

interface SearchAllButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
const SearchAllButton = React.memo<SearchAllButtonProps>((props) => {
  const { onClick } = props;

  return (
    <Button
      className={'w-full lg:ml-1 mb-5 lg:my-5 lg:w-80 flex flex-row aling-center justify-center'}
      type={'secondary'}
      onClick={onClick}
      icon={<ViewGridIcon />}
      iconSize={'small'}
    >
      Buscar todos los servicios
    </Button>
  );
});

interface ServiceProps {
  id: string;
  icon: ReactNode;
  description: string;
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export const ServiceButton = (props: ServiceProps) => {
  const { id, icon, description, active, onClick } = props;
  const borderColor = active ? '!border-primary' : 'border-white';
  const fontWeight = active ? 'font-semibold' : '!font-normal';
  return (
    <Button
      name={id}
      onClick={onClick}
      className={`bg-white w-full lg:w-80 lg:mr-2 !justify-start my-2 text-base !text-black ${fontWeight} ${borderColor}`}
      iconSize={'medium'}
      type={'tertiary'}
      icon={icon}
      alignment={'left'}
    >
      {description}
    </Button>
  );
};

const Home: NextPage<ServerSideProps> = React.memo(({ availableServices }) => {
  const [showPopup, setShowPopup] = useState(true);
  useEffect(() => {
    const hasPopupBeenShown = localStorage.getItem('hasPopupBeenShown');
    if (hasPopupBeenShown) {
      setShowPopup(false);
    }
    const handleBeforeUnload = () => {
      localStorage.removeItem('hasPopupBeenShown');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  const handlePopUpClose = () => {
    localStorage.setItem('hasPopupBeenShown', 'true');
    setShowPopup(false);
  };
  const [services, setServices] = useState<Record<string, ServicePill>>(
    Object.fromEntries(
      availableServices.map((serviceData: Service) => [
        serviceData.id,
        {
          id: serviceData.id,
          name: serviceData.name,
          // @ts-ignore
          icon: SERVICE_ICONS[serviceData.icon],
          selected: false,
        },
      ]),
    ),
  );
  const servicesSelected = Object.values(services).some((service) => service.selected);

  const toggleService = (serviceId: string) => {
    const serviceToUpdate = services[serviceId];
    if (!serviceToUpdate) {
      return;
    }
    setServices({
      ...services,
      [serviceToUpdate.id]: {
        ...serviceToUpdate,
        selected: !serviceToUpdate.selected,
      },
    });
  };

  const router = useRouter();
  const search = (servicesToSearch: ServicePill[]) => {
    if (servicesToSearch.length > 0) {
      router.push({
        pathname: '/buscar',
        query: {
          services: servicesToSearch.map((service) => service.id),
        },
      });
    }
  };

  const handleSearchAllButtonClicked = () => {
    search(Object.values(services));
  };

  const handleSearchButtonClicked = () => {
    search(Object.values(services).filter((service) => service.selected));
  };

  return (
    <div className={'flex flex-wrap flex-grow content-start justify-center lg:bg-modal-image lg:bg-white'}>
      <Head>
        <title>Dónde</title>
      </Head>
      <p className={'w-full lg:w-3/6 px-content text-xl font-title text-justify py-4 lg:bg-white'}>
        En esta plataforma vas a poder encontrar servicios de salud sexual y reproductiva y vacunatorios según tu ubicación. Esta
        herramienta fue creada por Fundación Huésped.
      </p>
      <MainContainer className={'w-full h-screen lg:h-full lg:w-3/5 lg:mx-4 mt-4 pt-8 lg:flex-grow-0'}>
        <div className="w-full flex flex-col justify-center">
          <div className="flex-col">
            <h2 className={'text-2xl text-black font-title font-bold text-center'}>¿Qué estás buscando?</h2>
            <p className={'text-xs text-black mt-2 text-center mb-3'}>Seleccioná los servicios que querés encontrar</p>
          </div>
          <div className="flex flex-col lg:flex-row flex-wrap justify-center">
            {Object.values(services).map((service) => (
              <ServiceButton
                key={service.id}
                id={service.id}
                icon={service.icon}
                description={service.name}
                active={service.selected}
                onClick={() => toggleService(service.id)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row flex-wrap justify-center">
          <SearchButton enabled={servicesSelected} onClick={handleSearchButtonClicked} />
          <SearchAllButton onClick={handleSearchAllButtonClicked} />
        </div>
      </MainContainer>
      {showPopup && (
        <Popup
        showPopup={showPopup}
        onClose={handlePopUpClose} />
      )}
    </div>
  );
});

export default Home;
