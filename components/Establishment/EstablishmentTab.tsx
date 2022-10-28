import { AtSymbolIcon, ClockIcon, GlobeAltIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/outline';
import React from 'react';
import { SERVICE_ICONS } from '../../config/services';
import { Establishment } from '../../model/establishment';
import { ServiceIcon } from '../../model/services';
import { formatEstablishmentLocation } from '../../utils/establishments';
import { CardList, CardListItem, CardSubHeader } from '../Card';
import { Icon } from '../Icon';

type Props = React.PropsWithChildren<{
  activeEstablishment: Establishment;
}>;

const EstablishmentTab = React.memo<Props>((props) => {
  const { activeEstablishment } = props;
  const [openTab, setOpenTab] = React.useState(-1);

  const addressNotes = null;
  const address = formatEstablishmentLocation(activeEstablishment);

  const getTime = (date: Date) => {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minutes = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
    const time = hour + ':' + minutes;
    return time;
  };

  const getDay = (day: string) => {
    switch (day) {
      case 'M':
        return 'Lunes';
      case 'T':
        return 'Martes';
      case 'W':
        return 'Miércoles';
      case 'R':
        return 'Jueves';
      case 'F':
        return 'Viernes';
      case 'S':
        return 'Sábado';
      case 'U':
        return 'Domingo';
    }
  };

  console.log(activeEstablishment);

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-nowrap pt-3 flex-row overflow-x-auto overflow-y-hidden scroll-style w-auto"
            role="tablist"
          >
            <li className="mr-2 mb-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  'nav-link font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 px-6 py-3 hover:border-transparent hover:bg-gray-100 focus:border-primary block  bg-white ' +
                  (openTab === -1 ? 'text-primary border-primary' : 'text-black border-transparent')
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(-1);
                }}
                data-toggle="tab"
                href="#id-info"
                role="tablist"
              >
                Información
              </a>
            </li>
            {activeEstablishment.services.map((serviceOnEstablishment, idx) => (
              <li key={serviceOnEstablishment.id} className="mb-2 mx-2 last:mr-0 flex-auto ">
                <a
                  className={
                    'w-full nav-link font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 hover:border-transparent hover:bg-gray-100 focus:border-primary pb-2 bg-white flex justify-center ' +
                    (openTab === idx ? 'border-primary' : 'border-transparent')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(idx);
                  }}
                  data-toggle="tab"
                  href={`#id-${serviceOnEstablishment.service.id}`}
                  role="tablist"
                >
                  <Icon size="medium" type="tertiary" icon={SERVICE_ICONS[serviceOnEstablishment.service.icon as ServiceIcon]} />
                </a>
              </li>
            ))}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === -1 ? 'block' : 'hidden'} id="id-info">
                  <CardList>
                    <CardListItem icon={<LocationMarkerIcon className={'text-primary'} />}>
                      {address} {addressNotes && <span className={'text-xs text-medium-gray'}>- {addressNotes}</span>}
                    </CardListItem>
                    {activeEstablishment.website && (
                      <CardListItem icon={<GlobeAltIcon className={'text-primary'} />}>
                        {activeEstablishment.website}
                      </CardListItem>
                    )}
                    {}
                    <CardSubHeader>Servicios disponibles</CardSubHeader>
                    {activeEstablishment.services.map((serviceOnEstablishment, idx) => (
                      <a
                        key={serviceOnEstablishment.id + idx}
                        className={'inherit'}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenTab(idx);
                        }}
                        data-toggle="tab"
                        href={`#id-${serviceOnEstablishment.service.id}`}
                        role="tablist"
                      >
                        <CardListItem
                          key={serviceOnEstablishment.id}
                          icon={SERVICE_ICONS[serviceOnEstablishment.service.icon as ServiceIcon]}
                        >
                          {serviceOnEstablishment.service.name && (
                            <>
                              <span>{serviceOnEstablishment.service.name}</span>
                            </>
                          )}
                        </CardListItem>
                      </a>
                    ))}
                  </CardList>
                </div>
                {activeEstablishment.services.map((serviceOnEstablishment, idx) => (
                  <div
                    key={serviceOnEstablishment.id}
                    className={openTab === idx ? 'block' : 'hidden'}
                    id={`id-${serviceOnEstablishment.service.id}`}
                  >
                    <CardList id={`tabs-${serviceOnEstablishment.service.id}`}>
                      {serviceOnEstablishment.phoneNumber && (
                        <CardListItem icon={<PhoneIcon className={'text-primary'} />}>
                          {serviceOnEstablishment.phoneNumber}
                        </CardListItem>
                      )}
                      {serviceOnEstablishment.email && (
                        <CardListItem icon={<AtSymbolIcon className={'text-primary'} />}>
                          {serviceOnEstablishment.email}
                        </CardListItem>
                      )}
                      {serviceOnEstablishment.openingTimes.length ? (
                        <CardListItem icon={<ClockIcon className={'text-primary'} />}>
                          <div className="flex flex-wrap">
                            {serviceOnEstablishment.openingTimes.map((date, idx) => {
                              return (
                                <span key={date.id + idx} className="mr-2">
                                  <>
                                    {getDay(date.day)} {date.startTime} - {date.endTime}
                                  </>
                                </span>
                              );
                            })}
                          </div>
                        </CardListItem>
                      ) : (
                        ''
                      )}

                      <CardSubHeader className={'text-medium-gray text-xs'}>
                        Descripción del servicio - <span>{serviceOnEstablishment.details}</span>
                      </CardSubHeader>
                      <CardListItem icon={SERVICE_ICONS[serviceOnEstablishment.service.icon as ServiceIcon]}>
                        <p>{serviceOnEstablishment.service.name}</p>
                      </CardListItem>
                      <div className="text-center">
                        {serviceOnEstablishment.service.name && serviceOnEstablishment.subservice ? (
                          <p className="text-primary font-light text-xs">{serviceOnEstablishment.subservice.name}</p>
                        ) : (
                          ''
                        )}
                      </div>
                    </CardList>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default EstablishmentTab;
