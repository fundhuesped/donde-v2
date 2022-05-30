import React, {FunctionComponent, SVGProps, useEffect, useState} from 'react';
import '@fontsource/poppins';
import { Header } from './Header';
import { Button } from './components/Button';
import {ReactComponent as CondonesIcon}  from './assets/images/Condones.svg';
import first from 'lodash/first';
interface Service {
  id: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title: string | undefined; }>
  description: string;
  isClicked: boolean;
}
function App() {
  const [services, setServices] = useState<Service[]>([]);
  const handleServiceButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const buttonClickedId = event.currentTarget.name;
    const serviceToUpdate = first(services.filter((service) => service.id === buttonClickedId))!;
    const updatedServices = services.map((service) => {
      if (service.id !== serviceToUpdate.id) {
        return service;
      }
      return { ...serviceToUpdate, isClicked: !serviceToUpdate.isClicked };
    });
    setServices(updatedServices);
  };

  const handleSearchAllButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const allClicked = services.map(service => service.isClicked).reduce((acc, isClicked) => acc && isClicked, true);
    const updatedServices = services.map(service => ({ ...service, isClicked: !allClicked }));
    setServices(updatedServices);
  };

  useEffect(() => {
    async function fetchServices() {
      const hardcodedServices = [
        { id: 'preservativos', icon: CondonesIcon, description: 'Preservativos', isClicked: false },
        { id: 'test-its', icon: CondonesIcon, description: 'Test de ITS', isClicked: false },
        { id: 'vacunatorios', icon: CondonesIcon, description: 'Vacunatorios', isClicked: false },
        { id: 'centros-infectologia', icon: CondonesIcon, description: 'Centros de infectología', isClicked: false },
        { id: 'anticonceptivos', icon: CondonesIcon, description: 'Métodos anticonceptivos', isClicked: false },
        {
          id: 'interrupcion-voluntaria-embarazo',
          icon: CondonesIcon,
          description: 'Interrupción voluntaria del embarazo',
          isClicked: false,
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
          const borderColor = service.isClicked ? '!border-donde-primary' : 'border-white';
          return (
            <Button
              key={service.id}
              name={service.id}
              onClick={handleServiceButtonClicked}
              className={`bg-white rounded-2xl w-full max-w-xs border-2 !justify-start my-5 mx-auto ${borderColor}`}
              disabled={true}
              iconSize={'large'}
              type={'tertiary'}
            >
              {service.description}
            </Button>
          );
        })}
        <Button className={'bg-white rounded-2xl w-full max-w-xs  my-5 mx-auto'} disabled={true} type={'primary'}>
          Buscar
        </Button>
        <Button
          className={'bg-white rounded-2xl w-full max-w-xs  my-5 mx-auto'}
          type={'secondary'}
          onClick={handleSearchAllButtonClicked}
        >
          Explorar todos los servicios
        </Button>
      </div>
    </div>
  );
}

export default App;
