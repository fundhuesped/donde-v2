import { LocationMarkerIcon, PlusIcon } from '@heroicons/react/outline';
import { UserRole } from '@prisma/client';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { SERVICE_ICONS } from '../../../config/services';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { Establishment } from '../../../model/establishment';
import { ServiceIcon } from '../../../model/services';
import { Card, CardHeader, CardList, CardListItem } from '../../Card';
import { Pill } from '../../Pill';

type Props = React.PropsWithChildren<{
  establishments: Establishment[];
  mapVisibility: string;
  setMapVisibility: (x: string) => void;
  setActiveEstablishment: (x: Establishment | null) => void;
}>;

const EstablishmentList = React.memo<Props>((props) => {
  const { establishments, mapVisibility, setActiveEstablishment, setMapVisibility } = props;
  const router = useRouter();
  const user = useAuthenticatedUser();

  const handleDetailsClick = (establishmentId: string) => {
    setMapVisibility('block');
    setActiveEstablishment(establishments.find((establishment) => establishment.id === establishmentId) ?? null);
  };

  return (
    <div
      className={`${
        mapVisibility == 'hidden' ? 'block' : 'hidden'
      } lg:block bg-ultra-light-gray lg:bg-inherit w-100 h-full lg:h-4/6 scroll-style overflow-auto relative mt-4`}
    >
      {establishments && establishments.length ? (
        establishments.map((establishment) => {
          return (
            <Card
              key={establishment.id}
              className={'my-2 pb-6 mx-3 lg:mx-0 cursor-pointer'}
              onClick={() => handleDetailsClick(establishment.id)}
            >
              <CardHeader className={'font-title text-lg'}>{establishment.name}</CardHeader>
              <CardList>
                <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
                  {establishment.street} {establishment.streetNumber}
                </CardListItem>
                {uniqBy(
                  establishment.services.map((service) => service.service),
                  (service) => service.id,
                ).map((service) => (
                  <CardListItem key={service.id} icon={SERVICE_ICONS[service.icon as ServiceIcon]}>
                    {service.name}
                  </CardListItem>
                ))}
              </CardList>
              <footer className={classNames('mt-4 w-full p-0 flex justify-start')}>
                <Pill className="{text-xs }">Cargado por Fundación Huesped</Pill>
              </footer>
            </Card>
          );
        })
      ) : (
        <div className="mt-4 p-6 lg:p-0 mx-3 lg:mx-0 text-center lg:text-start">
          <p className="font-title text-md">
            <span className="font-bold text-lg">No hay coincidencias con establecimientos </span>
            <br />
            Probá cambiar o eliminar algunos filtros o ajustar la zona de búsqueda.
          </p>
        </div>
      )}
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.COLLABORATOR) && (
        <div className="hidden lg:block mt-4">
          <button
            onClick={async () => {
              await router.push({ pathname: '/establecimientos/nuevo' });
            }}
            className="flex bg-inherent text-primary border-none text-sm font-bold mt-1.5 mr-3"
          >
            <span className="mr-1 mt-0.5">
              <PlusIcon className=" w-4 mx-1 text-primary" />
            </span>
            Agregar establecimiento
          </button>
        </div>
      )}
    </div>
  );
});

export default EstablishmentList;
