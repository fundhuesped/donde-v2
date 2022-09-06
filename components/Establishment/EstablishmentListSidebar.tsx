import { CheckIcon, ClockIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';
import Filter from '../../assets/images/Filter.svg';
import { Card, CardHeader, CardList, CardListItem } from '../Card';
import { Pill } from '../Pill';

type Props = React.PropsWithChildren<{
  services: { id: string; name: string }[];
  establishments: { key: number; establecimiento: string; horario_testeo: string | null; calle: string }[];
}>;

const EstablishmentListSidebar = React.memo<Props>((props) => {
  const { children, services, establishments } = props;
  return (
    <div className="mt-6 flex flex-wrap max-h-[85vh] overflow-auto">
      <div className="w-1/4"></div>
      <div className="w-3/4 flex flex-wrap">
        <div className={'mt-2 mb-6'}>
          <h2 className={'font-title text-2xl text-black font-bold'}>Resultados de búsqueda</h2>
          <div className="mt-4 ml-1 w-full flex justify-between">
            <div className="flex">
              {services.map((service) => (
                <Pill type={'secondary'} className={'py-2 mr-2 h-fit'} key={service.id}>
                  {service.name}
                </Pill>
              ))}
            </div>

            <button className="bg-inherent text-primary border-none text-sm font-bold flex mt-1.5">
              <span className="mr-1 mt-0.5">
                <Filter />
              </span>
              Filtrar
            </button>
          </div>
        </div>
      </div>
      {establishments.map((establishment) => {
        return (
          <div key={establishment.key} className={'w-full flex justify-end mr-5'}>
            <Card className={'my-2 pb-6 w-3/4'}>
              <CardHeader className={'font-title text-lg'}>{establishment.establecimiento}</CardHeader>
              <CardList>
                <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>{establishment.calle}</CardListItem>
                {establishment.horario_testeo ? (
                  <CardListItem icon={<ClockIcon className={'text-primary'} />}>{establishment.horario_testeo}</CardListItem>
                ) : (
                  ''
                )}

                <CardListItem icon={<CheckIcon className={'text-primary'} />}>
                  {services.map((service) => (
                    <span key={service.id}>{service.name}</span>
                  ))}
                </CardListItem>
              </CardList>
              <footer className={classNames('mt-4')}>
                <Pill>Cargado por Fundación Huesped</Pill>
              </footer>
            </Card>
          </div>
        );
      })}
    </div>
  );
});

export default EstablishmentListSidebar;
