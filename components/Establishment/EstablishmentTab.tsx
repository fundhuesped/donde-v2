import { ClockIcon, LocationMarkerIcon, PhoneIcon } from '@heroicons/react/outline';
import React from 'react';
import { SERVICE_ICONS } from '../../config/services';
import { Establishment } from '../../model/establishment';
import { ServiceIcon } from '../../model/services';
import { formatEstablishmentLocation } from '../../utils/establishments';
import { CardList, CardListItem, CardSubHeader } from '../Card';

type Props = React.PropsWithChildren<{
  activeEstablishment: Establishment;
}>;

const EstablishmentTab = React.memo<Props>((props) => {
  const { activeEstablishment } = props;
  const [openTab, setOpenTab] = React.useState(-1);

  const addressNotes = null;
  const address = formatEstablishmentLocation(activeEstablishment);

  console.log(activeEstablishment.services.map((service) => service));

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
                  'nav-link font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 hover:border-transparent hover:bg-gray-100 focus:border-primary block  bg-white ' +
                  (openTab === -1 ? 'text-primary' : 'text-black')
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
              <li key={serviceOnEstablishment.id} className="mb-2 mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    'truncate ... nav-link font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 hover:border-transparent hover:bg-gray-100 focus:border-primary block  bg-white ' +
                    (openTab === idx ? 'text-primary' : 'text-black')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(idx);
                  }}
                  data-toggle="tab"
                  href={`#id-${serviceOnEstablishment.service.id}`}
                  role="tablist"
                >
                  {serviceOnEstablishment.service.name}
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
                    <CardSubHeader>Servicios disponibles</CardSubHeader>
                    {activeEstablishment.services.map((serviceOnEstablishment) => (
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
                      <CardListItem icon={<PhoneIcon className={'text-primary'} />}>
                        {serviceOnEstablishment.phoneNumber}
                      </CardListItem>
                      <CardListItem icon={<ClockIcon className={'text-primary'} />}>
                        <span>Lunes 09:30-12:00</span>
                        <br />
                        <span>Martes 10:30-12:00</span>
                        {/* service.openingTimes.day {service.openingTimes.startTime}-{service.openingTimes.endTime} */}
                      </CardListItem>
                      <CardSubHeader className={'text-medium-gray text-xs'}>
                        Descripción del servicio - <span>{serviceOnEstablishment.details}</span>
                      </CardSubHeader>
                      <CardListItem icon={SERVICE_ICONS[serviceOnEstablishment.service.icon as ServiceIcon]}>
                        {serviceOnEstablishment.service.name && (
                          <>
                            <p>{serviceOnEstablishment.service.name}</p>
                          </>
                        )}
                      </CardListItem>
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
