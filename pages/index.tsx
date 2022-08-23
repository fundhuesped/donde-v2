import type { NextPage } from 'next';
import Head from 'next/head';
import React, { ReactNode, useState } from 'react';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import { SERVICE_ICONS } from '../config/services';
import servicesData from '../assets/services.json';
import { useRouter } from 'next/router';

type Service = {
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
    <Button className={'w-full my-5 lg:max-w-sm lg:mx-auto'} disabled={!enabled} type={'primary'} onClick={onClick}>
      Buscar
    </Button>
  );
});

// interface SearchAllButtonProps {
//   onClick: React.MouseEventHandler<HTMLButtonElement>;
// }
// const SearchAllButton = React.memo<SearchAllButtonProps>((props) => {
//   const { onClick } = props;
//
//   return (
//     <Button className={'w-full my-5'} type={'secondary'} onClick={onClick}>
//       Buscar todos los servicios
//     </Button>
//   );
// });

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
      className={`bg-white w-full !justify-start my-5 text-base !text-black ${fontWeight} ${borderColor}`}
      iconSize={'large'}
      type={'tertiary'}
      icon={icon}
      alignment={'left'}
    >
      {description}
    </Button>
  );
};

const Home: NextPage = React.memo(() => {
  const [services, setServices] = useState<Record<string, Service>>(
    Object.fromEntries(
      servicesData.map((serviceData) => [
        serviceData.id,
        {
          id: serviceData.id,
          name: serviceData.name,
          icon: SERVICE_ICONS[serviceData.id],
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
  const search = (servicesToSearch: Service[]) => {
    if (servicesToSearch.length > 0) {
      router.push({
        pathname: '/buscar',
        query: {
          services: servicesToSearch.map((service) => service.id),
        },
      });
    }
  };

  // const handleSearchAllButtonClicked = () => {
  //   search(Object.values(services));
  // };

  const handleSearchButtonClicked = () => {
    search(Object.values(services).filter((service) => service.selected));
  };

  return (
    <>
      <Head>
        <title>Dónde</title>
      </Head>

      <p className={'px-content my-4 text-xl font-title text-justify'}>
        <strong>Dónde</strong> es una plataforma que te permite encontrar servicios de salud.
      </p>
      <MainContainer className={'mt-4 pt-8 lg:mx-auto lg:grow-0 lg:p-8 lg:min-w-desktop'}>
        <h2 className={'text-xl text-black font-title font-bold'}>¿Qué estás buscando?</h2>
        <p className={'text-xs text-black mt-2'}>Seleccioná el servicio que querés encontrar</p>
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
        <SearchButton enabled={servicesSelected} onClick={handleSearchButtonClicked} />
        {/*<SearchAllButton onClick={handleSearchAllButtonClicked} />*/}
      </MainContainer>
    </>
  );
});

export default Home;
