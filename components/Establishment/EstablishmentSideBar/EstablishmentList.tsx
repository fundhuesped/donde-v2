import { LocationMarkerIcon, PlusIcon } from '@heroicons/react/outline';
import { UserRole } from '@prisma/client';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SERVICE_ICONS } from '../../../config/services';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { ActiveEstablishment, Establishment } from '../../../model/establishment';
import { ServiceIcon } from '../../../model/services';
import { Card, CardHeader, CardList, CardListItem } from '../../Card';
import Loading from '../../Loading';
import { Pill } from '../../Pill';
import { MapPosition } from '../../../pages/establecimientos';
import axios from 'axios';
type Props = React.PropsWithChildren<{
  establishments: Establishment[];
  mapVisibility: string;
  setMapVisibility: (x: string) => void;
  setActiveEstablishment: (x: ActiveEstablishment | null) => void;
  searchLocationParam?: string | string[];
  mapPosition: MapPosition;
  searchedServiceIds: any;
}>;

const EstablishmentList = React.memo<Props>((props) => {
  const { searchedServiceIds, mapPosition, establishments, mapVisibility, setActiveEstablishment, setMapVisibility, searchLocationParam } = props;
  const router = useRouter();
  const user = useAuthenticatedUser();
  const [loading, setLoading] = useState(true);

  const handleDetailsClick = async (establishmentId: string) => {

    const selectedEstablishmentDistance =
      await axios.get(
        `/api/establishments/distance?coords[lat]=${mapPosition?.coords.lat}&coords[lng]=${mapPosition?.coords.lng}&establishmentId=${establishmentId}`,
        {
          params: { services: searchedServiceIds }
        }).then((res) => res.data)

    const findSelectedEstablishment = establishments.find((establishment: Establishment) => establishment.id === establishmentId);

    const selectedEstablishment: ActiveEstablishment | null = findSelectedEstablishment ? {
      ...findSelectedEstablishment,
      distance: selectedEstablishmentDistance.distance,
    } : null;


    setMapVisibility('block');
    setActiveEstablishment(selectedEstablishment)

  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [loading, establishments]);

  return (
    <div
      className={`${mapVisibility == 'hidden' ? 'block' : 'hidden'
        } lg:block bg-ultra-light-gray lg:bg-inherit w-100 lg:h-[calc(100vh_-_295px)] lg:scroll-style lg:overflow-auto relative mt-2`}
    >
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.COLLABORATOR) && (
        <div className="hidden lg:block mb-4 lg:ml-2">
          <button
            onClick={async () => {
              await router.push({
                pathname: '/establecimientos/nuevo',
                query: {
                  searchLocation: searchLocationParam,
                },
              });
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
      {loading && (
        <div className="flex justify-center p-4">
          <Loading />
        </div>
      )}
      {establishments && establishments.length
        ? establishments.map((establishment) => {
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
              <footer className={classNames('mt-4 w-full p-0 flex justify-start flex-col')}>
                <Pill className="text-dark-gray text-xs mb-4 bg-ultra-light-gray">{`Creado por ${establishment.createdBy ?? 'Fundación Huesped'}`}</Pill>
                {establishment.lastModifiedBy && establishment.createdBy !== establishment.lastModifiedBy && <Pill className="text-dark-gray text-xs bg-ultra-light-gray">{`Actualizado por ${establishment.lastModifiedBy ?? 'Fundación Huesped'}`}</Pill>}
              </footer>
            </Card>
          );
        })
        : ''}
      {!loading && establishments && !establishments.length ? (
        <div className="mt-4 p-6 lg:p-0 mx-3 lg:mx-0 lg:ml-2 text-center lg:text-start">
          <p className="font-title text-md">
            <span className="font-bold text-lg">No hay coincidencias con establecimientos </span>
            <br />
            Probá cambiar o eliminar algunos filtros o ajustar la zona de búsqueda.
          </p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
});

export default EstablishmentList;
