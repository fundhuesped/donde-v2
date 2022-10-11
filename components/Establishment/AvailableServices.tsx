import { PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Service } from '../../model/services';
import { Pill } from '../Pill';
import { NewService } from './NewService';

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void;
  availableServices: Service[];
  activeServices: Set<string>;
};

export const AvailableServices = (props: AvailableServicesProps) => {
  const { activeServices, availableServices, onChange } = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const isChecked = (serviceId: string) => activeServices.has(serviceId);
  const removeServices = (services: string[]) => {
    const updatedServices = new Set(activeServices);
    services.forEach((serviceId) => updatedServices.delete(serviceId));
    onChange({ services: updatedServices });
  };
  const addService = (defaultService: string, selectedService: string | undefined, otherServices: string[]) => {
    const updatedServices = new Set(activeServices);
    otherServices.forEach((serviceId) => updatedServices.delete(serviceId));
    updatedServices.add(defaultService);
    if (selectedService) {
      updatedServices.add(selectedService);
    }
    onChange({ services: updatedServices });
  };

  console.log(availableServices)

  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h1>
      <ul className={'flex flex-col'}>
         <button onClick={()=>setShowModal(true)} className={'flex color-primary font-bold p-2 btn-inherit'}>
              <span className="mr-1 mt-1">
                  <PlusIcon className=" w-4 mx-1 text-primary" />
              </span>
              Agregar servicio
          </button>
          <div className="flex flex-wrap h-auto w-3/4">
             {availableServices.map((service) => (
              <Pill type={'primary'} className={'py-1 mr-2 mb-2 h-fit flex align-middle border border-gray-600'} key={service.id}>
                <span className='mt-1 mr-2'>{service.name}</span>
                 <PencilIcon className='text-primary w-6 h-6 p-1'/>
              </Pill>
            ))}
          </div>
         
        {/* {Object.values(groupBy(availableServices, (service) => service.id)).map((services) => {
          const [[defaultService], otherServices] = partition(services, (service) => service.name === null);
          if (!defaultService) {
            return null;
          }
          const checked = isChecked(defaultService.id);
          const selectedService = otherServices.find((service) => activeServices.has(service.id));
          return (
            <li key={defaultService.id}>
              <label className={'cursor-pointer'} htmlFor={`checkbox-${defaultService.id}`}>
                <input
                  id={`checkbox-${defaultService.id}`}
                  name={defaultService.id}
                  className={'cursor-pointer mr-2'}
                  type={'checkbox'}
                  checked={checked}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    if (checked) {
                      addService(
                        defaultService.id,
                        selectedService?.id ?? otherServices[0]?.id,
                        otherServices.map(({ id }) => id),
                      );
                    } else {
                      removeServices(services.map(({ id }) => id));
                    }
                  }}
                />
                {defaultService.name}
              </label>
              {otherServices.length > 0 && (
                <select
                  className={'bg-white border border-light-gray rounded ml-2'}
                  defaultValue={selectedService?.id}
                  onChange={(event) =>
                    addService(
                      defaultService.id,
                      event.target.value,
                      otherServices.map(({ id }) => id),
                    )
                  }
                >
                  {otherServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              )}
            </li>
          );
        })} */}

      </ul>
      {showModal ? (<NewService showModal={showModal} setShowModal={setShowModal}/>): ""}
    </>
  );
};
