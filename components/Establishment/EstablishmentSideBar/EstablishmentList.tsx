import { CheckIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';
import { Card, CardHeader, CardList, CardListItem } from '../../Card';
import { Pill } from '../../Pill';

type Props = React.PropsWithChildren<{
  services: { id: string; name: string }[];
  establishments: {
    key: number;
    name: string;
    street: string;
    streetNumber: string;
    specialties: { specialty: { id: string; name: string } }[];
  }[];
}>;

const EstablishmentList = React.memo<Props>((props) => {
  const { establishments } = props;
  return (
    <div className="bg-ultra-light-gray lg:bg-inherit w-100 h-full lg:h-3/6 overflow-y-scroll">
      <Card className={'my-2 pb-6 mx-3 lg:mx-0'}>
        <CardHeader className={'font-title text-lg'}>Hospital</CardHeader>
        <CardList>
          <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>calle 123</CardListItem>
        </CardList>
        <footer className={classNames('mt-4')}>
          <Pill>Cargado por Fundación Huesped</Pill>
        </footer>
      </Card>
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
                {establishment.specialties.map((specialty) => {
                  return (
                    <CardListItem key={specialty.specialty.id} icon={<CheckIcon className={'text-primary'} />}>
                      <span> {specialty.specialty.name}</span>
                    </CardListItem>
                  );
                })}
              </CardList>
              <footer className={classNames('mt-4')}>
                <Pill>Cargado por Fundación Huesped</Pill>
              </footer>
            </Card>
          );
        })}
    </div>
  );
});

export default EstablishmentList;
