import React, { ReactNode, useEffect, useState } from 'react';
import '@fontsource/poppins';
import { Header } from './Header';
import { Button } from './components/Button';
import { ReactComponent as CondonesIcon } from './assets/images/Condones.svg';
import { ServiceButton } from './ServiceButton';
import { Link } from "react-router-dom";

interface Service {
  id: string;
  icon: ReactNode;
  description: string;
  active: boolean;
}

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const isDisabled = !services.some((service) => service.active);

  const handleServiceButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const buttonClickedId = event.currentTarget.name;
    const serviceToUpdate = services.find((service) => service.id === buttonClickedId)!;
    const updatedServices = services.map((service) => {
      if (service.id !== serviceToUpdate.id) {
        return service;
      }
      return { ...serviceToUpdate, active: !serviceToUpdate.active };
    });
    setServices(updatedServices);
  };

  const handleSearchAllButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    search(services);
  };

  const handleSearchButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    search(services.filter((service) => service.active));
  };

  const search = (servicesToSearch: Service[]) => {
    // do something
    console.log(servicesToSearch);
  };

  useEffect(() => {
    function fetchServices() {
      const hardcodedServices = [
        { id: 'preservativos', icon: <CondonesIcon />, description: 'Preservativos', active: false },
        { id: 'test-its', icon: <CondonesIcon />, description: 'Test de ITS', active: false },
        { id: 'vacunatorios', icon: <CondonesIcon />, description: 'Vacunatorios', active: false },
        { id: 'centros-infectologia', icon: <CondonesIcon />, description: 'Centros de infectología', active: false },
        { id: 'anticonceptivos', icon: <CondonesIcon />, description: 'Métodos anticonceptivos', active: false },
        {
          id: 'interrupcion-voluntaria-embarazo',
          icon: <CondonesIcon />,
          description: 'Interrupción voluntaria del embarazo',
          active: false,
        },
      ];
      setServices(hardcodedServices);
    }
    fetchServices();
  }, []);

  return (
    <div className={'py-4  px-1 mx-auto  max-w-sm'}>
      <Header />
      <div className={'bg-donde-gray-200 mx-1 px-1 py-6 mt-6 rounded-t-3xl'}>
        <p className={'text-xl px-2 mb-6 text-donde-black-100'}>
          Encontrá los servicios de <strong>salud sexual y reproductiva </strong> que estás necesitando
        </p>
        <p className={'text-xs px-2 my-6 text-donde-black-100'}>Seleccioná los servicios que querés encontrar</p>
        {services.map((service) => {
          return (
            <ServiceButton
              key={service.id}
              id={service.id}
              icon={service.icon}
              description={service.description}
              active={service.active}
              onClick={handleServiceButtonClicked}
            />
          );
        })}
        <Link to="/buscar">
          <Button
            className={'bg-white w-full max-w-xs  my-5 mx-auto'}
            disabled={isDisabled}
            type={'primary'}
            onClick={handleSearchButtonClicked}
          >
            Buscar
          </Button>
        </Link>
        <Button className={'bg-white w-full max-w-xs  my-5 mx-auto'} type={'secondary'} onClick={handleSearchAllButtonClicked}>
          Buscar todos los servicios
        </Button>
      </div>
    </div>
  );
}

export default App;
