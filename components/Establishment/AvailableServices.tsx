import { PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { ServiceOnEstablishmentOpeningTime, Subservice } from '@prisma/client';
import { useState } from 'react';
import { Service } from '../../model/services';
import { Pill } from '../Pill';
import { Services } from './Services';

export type ServicesModal = {
  id: string;
  serviceId: string;
  subserviceId: string | null;
  service: Service;
  subservice: Subservice | null;
  phoneNumber: string | null;
  details: string | null;
  email: string | null;
  openingTimes: ServiceOnEstablishmentOpeningTime[];
}[];

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void;
  availableServices: Service[];
  activeServicesId: Set<string>;
  activeServices: ServicesModal;
};

export const AvailableServices = (props: AvailableServicesProps) => {
  const { activeServicesId, activeServices, availableServices, onChange } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalServiceId, setModalServiceId] = useState<string>('');
  const [modalService, setModalService] = useState<ServicesModal>();

  const isChecked = (serviceId: string) => activeServicesId.has(serviceId);

  const editService = (id: string) => {
    if (activeServicesId.has(id)) {
      const serviceFilter = activeServices.filter((services) => services.serviceId == id);
      setModalServiceId(id);
      setModalService(serviceFilter);
      setShowModal(true);
    }
  };

  const newService = () => {
    setModalServiceId('');
    setModalService([]);
    setShowModal(true);
  };

  return (
    <>
      <h2 className={'my-2 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h2>
      <button onClick={() => newService()} className={'flex color-primary font-bold p-2 btn-inherit'}>
        <span className="mr-1 mt-1">
          <PlusIcon className=" w-4 mx-1 text-primary" />
        </span>
        Agregar servicio
      </button>
      <div className="flex flex-wrap h-auto w-full lg:w-3/4">
        {availableServices.map((service) => {
          const checked = isChecked(service.id);
          if (checked) {
            return (
              <button key={service.id} onClick={() => editService(service.id)} className="inherit">
                <Pill
                  type={'primary'}
                  className={'text-dark-gray py-1 mr-2 mb-2 h-fit flex align-middle border border-gray-600 cursor-pointer'}
                >
                  <span className="mt-1 mr-2">{service.name}</span>
                  <PencilIcon className="text-primary w-6 h-6 p-1" />
                </Pill>
              </button>
            );
          }
        })}
      </div>
      {showModal ? (
        <Services
          showModal={showModal}
          setShowModal={setShowModal}
          onChange={onChange}
          activeServicesId={activeServicesId}
          activeServices={activeServices}
          availableServices={availableServices}
          modalServiceId={modalServiceId}
          modalService={modalService}
        />
      ) : (
        ''
      )}
    </>
  );
};
