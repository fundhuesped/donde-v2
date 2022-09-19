import { LocationMarkerIcon, PlusIcon } from '@heroicons/react/outline';
import { UserRole } from '@prisma/client';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { SERVICE_ICONS } from '../../../config/services';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { ServiceIcon } from '../../../model/services';
import { Card, CardHeader, CardList, CardListItem } from '../../Card';
import { Pill } from '../../Pill';

type Props = React.PropsWithChildren<{
  establishments: {
    key: number;
    name: string;
    id: string;
    street: string;
    streetNumber: string;
    specialties: { specialty: { id: string; name: string; service: { id: string; icon: string; name: string } } }[];
  }[];
  mapVisibility: string;
}>;

const EstablishmentList = React.memo<Props>((props) => {
  const { establishments, mapVisibility } = props;
  const router = useRouter();
  const user = useAuthenticatedUser();

  const handleDetailsClick = (id: string) => {
    router.push(`/establecimientos/${id}`);
  };

  return (
    <div
      className={`${
        mapVisibility == 'hidden' ? 'block' : 'hidden'
      } lg:block bg-ultra-light-gray lg:bg-inherit w-100 h-full lg:h-5/6 scroll-style overflow-auto relative mt-4`}
    >
      {establishments && establishments.length ? (
        establishments.map((establishment) => {
          return (
            <Card
              onClick={() => handleDetailsClick(establishment.id)}
              key={establishment.key}
              className={'my-2 pb-6 mx-3 lg:mx-0'}
            >
              <CardHeader className={'font-title text-lg'}>{establishment.name}</CardHeader>
              <CardList>
                <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
                  {establishment.street} {establishment.streetNumber}
                </CardListItem>
                {/* {establishment.horario_testeo ? (
                  <CardListItem icon={<ClockIcon className={'text-primary'} />}>Horario</CardListItem>
                ) : (
                  ''
                )} */}
                {uniqBy(
                  establishment.specialties.map((specialty) => specialty.specialty.service),
                  (service) => service.id,
                ).map((service) => (
                  <CardListItem key={service.id} icon={SERVICE_ICONS[service.icon as ServiceIcon]}>
                    {service.name}
                  </CardListItem>
                ))}
              </CardList>
              <footer className={classNames('mt-4 w-full p-0 flex justify-start cursor-pointer')}>
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
          {user?.role === UserRole.ADMIN && (
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
      )}
    </div>
  );
});

export default EstablishmentList;
