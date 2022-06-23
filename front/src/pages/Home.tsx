import React, { ReactNode, useState } from 'react';
import { ServiceButton } from '../ServiceButton';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import MainContainer from '../components/MainContainer';
import isEmpty from 'lodash/isEmpty';
import servicesData from '../assets/services.json';
import { SERVICE_ICONS } from '../config/services';

type Service = {
  id: string;
  name: string;
  icon: ReactNode;
  selected: boolean;
};

const Home = React.memo(() => {
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

  const navigate = useNavigate();
  const search = (servicesToSearch: Service[]) => {
    if (!isEmpty(servicesToSearch)) {
      navigate('/buscar', {
        state: { services: servicesToSearch.map((service) => service.id) },
      });
    }
  };

  const handleSearchAllButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    search(Object.values(services));
  };

  const handleSearchButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    search(Object.values(services).filter((service) => service.selected));
  };

  return (
    <>
      <p className={'px-content my-4 text-xl font-title text-justify'}>
        <strong>Dónde</strong> es una plataforma que te permite encontrar servicios de salud en toda América Latina.
      </p>
      <MainContainer className={'mt-4 pt-8'}>
        <h2 className={'text-xl text-black font-title font-bold'}>¿Qué estás buscando?</h2>
        <p className={'text-xs text-black mt-2'}>Seleccioná los servicios que querés encontrar</p>
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
        <Button
          className={'bg-white w-full my-5'}
          disabled={!servicesSelected}
          type={'primary'}
          onClick={handleSearchButtonClicked}
        >
          Buscar
        </Button>
        {/*<Button className={'w-full my-5'} type={'secondary'} onClick={handleSearchAllButtonClicked}>*/}
        {/*  Buscar todos los servicios*/}
        {/*</Button>*/}
      </MainContainer>
    </>
  );
});

export default Home;
