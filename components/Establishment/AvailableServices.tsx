import { groupBy, partition } from 'lodash';
import { Service } from '../../model/services';

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void;
  availableServices: Service[];
  activeServices: Set<string>;
};

export const AvailableServices = (props: AvailableServicesProps) => {
  const { activeServices, availableServices, onChange } = props;
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

  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h1>
      <ul className={'flex flex-col'}>
        {Object.values(groupBy(availableServices, (service) => service.id)).map((services) => {
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
        })}
      </ul>
    </>
  );
};
