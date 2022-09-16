import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/outline';
import React from 'react';
import Filter from '../../../assets/images/Filter.svg';
import { Pill } from '../../Pill';

type Props = React.PropsWithChildren<{ services: { id: string; name: string }[] }>;
const EstablishmentHeader = React.memo<Props>((props) => {
  const { children, services } = props;
  return (
    <div className={'mt-1  mb-6 lg:mb-0 bg-white lg:bg-inherit'}>
      <div className="py-4 lg:py-1">
        <div className="w-full flex justify-between">
          <ChevronLeftIcon className="block lg:hidden w-6 mx-3" />
          <h2 className={'font-title text-lg lg:text-2xl text-black font-bold'}>Resultados de búsqueda</h2>
          <div className="block lg:hidden mx-5">
            <button className="flex bg-inherent text-primary border-none text-sm font-bold mt-1.5">
              <span className="mr-1 mt-0.5">
                <Filter />
              </span>
              Filtrar
            </button>
          </div>
        </div>

        <div className="mt-4 w-full flex-col lg:flex-row flex justify-between">
          <div className="flex flex-wrap w-3/4 h-auto ml-2 lg:ml-0">
            {services.map((service) => (
              <Pill type={'secondary'} className={'py-2 mr-2 mb-1 w-fit h-max-12'} key={service.id}>
                {service.name}
              </Pill>
            ))}
          </div>
          <div className="lg:hidden flex justify-end">
            <button className="flex bg-inherent text-primary border-none text-sm font-bold mt-1.5 mr-3">
              <span className="mr-1 mt-0.5">
                <PlusIcon className=" w-4 mx-1 text-primary" />
              </span>
              Agregar establecimiento
            </button>
          </div>
          <div className="hidden lg:block">
            <button className="bg-inherent text-primary border-none text-sm font-bold flex mt-1.5">
              <span className="mr-1 mt-0.5">
                <Filter />
              </span>
              Filtrar
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
});

export default EstablishmentHeader;
