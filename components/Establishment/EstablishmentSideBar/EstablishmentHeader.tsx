import { PlusIcon } from '@heroicons/react/outline';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import Filter from '../../../assets/images/Filter.svg';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { Pill } from '../../Pill';

type Props = React.PropsWithChildren<{ 
  services: { id: string; name: string }[];
  searchLocationParam?:string | string[]
}>;

const EstablishmentHeader = React.memo<Props>((props) => {
  const { children, services, searchLocationParam } = props;
  const router = useRouter();
  const user = useAuthenticatedUser();

  return (
    <div className={'mt-1 mb-6 lg:mb-0 bg-white lg:bg-inherit w-full'}>
      <div className="py-4 lg:py-1">
        <div className="flex justify-items-start">
          <h2 className={'font-title text-lg ml-3 lg:text-2xl text-black font-bold'}>Resultados de búsqueda</h2>
          <div className="mr-4 hidden">
            <button className="flex bg-inherent text-primary border-none text-sm font-bold mt-1.5 relative lg:absolute lg:top-20 lg:right-4">
              <span className="mr-1 mt-0.5">
                <Filter />
              </span>
              Filtrar
            </button>
          </div>
        </div>

        <div className="mt-4 w-full flex flex-col lg:flex-row justify-around">
          <div className="px-2 lg:px-0 flex flex-wrap w-screen lg:w-96 h-auto ml-0 relative">
            {services.map((service) => (
              <Pill type={'secondary'} className={'py-2 mr-1 mb-1 lg:py-1 w-fit h-max-12 flex-none flex'} key={service.id}>
                {service.name}
              </Pill>
            ))}
          </div>
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.COLLABORATOR) && (
            <div className="lg:hidden flex justify-end w-screen px-3">
              <button
                onClick={async () => {
                  await router.push({  
                    pathname: '/establecimientos/nuevo',
                    query: {
                      searchLocation: searchLocationParam,
                    }, 
                  });
                }}
                className="flex bg-inherent text-primary border-none text-sm font-bold mt-1.5"
              >
                <span className="mr-1 mt-0.5">
                  <PlusIcon className=" w-4 mx-1 text-primary" />
                </span>
                Agregar establecimiento
              </button>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
});

export default EstablishmentHeader;
