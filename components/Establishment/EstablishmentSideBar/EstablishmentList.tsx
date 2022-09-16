import { LocationMarkerIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { uniqBy } from 'lodash';
import React from 'react';
import { SERVICE_ICONS } from '../../../config/services';
import { ServiceIcon } from '../../../model/services';
import { Card, CardHeader, CardList, CardListItem } from '../../Card';
import { Pill } from '../../Pill';

type Props = React.PropsWithChildren<{
  services: { id: string; name: string }[];
  establishments: {
    key: number;
    name: string;
    street: string;
    streetNumber: string;
    specialties: { specialty: { id: string; name: string; service: { id: string; icon: string; name: string } } }[];
  }[];
}>;

const EstablishmentList = React.memo<Props>((props) => {
  const { establishments } = props;
  return (
    <div className="bg-ultra-light-gray lg:bg-inherit w-100 h-full lg:h-3/6 overflow-y-scroll relative">
      {establishments &&
        establishments.map((establishment) => {
          return (
            <Card key={establishment.key} className={'my-2 pb-6 mx-3 lg:mx-0'}>
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
              <footer className={classNames('mt-4 w-full p-0 flex justify-start')}>
                <Pill className="{text-xs}">Cargado por Fundación Huesped</Pill>
              </footer>
            </Card>
          );
        })}
    </div>
  );
});

export default EstablishmentList;
