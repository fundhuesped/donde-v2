import React from 'react';

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void;
  services: { id: string; name: string }[];
  specialties: Set<string>;
};
export const AvailableServices = (props: AvailableServicesProps) => {
  const { specialties, services, onChange } = props;
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, checked } = event.currentTarget;
    let updatedServices = new Set(specialties);
    if (checked) {
      updatedServices.add(name);
    } else {
      updatedServices.delete(name);
    }
    onChange({ availableServices: updatedServices });
  };
  const isChecked = (serviceId: string) => specialties.has(serviceId);
  debugger;
  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h1>
      {services?.map((service) => {
        return (
          <label key={service.id}>
            <input
              name={service.id}
              className={'mr-2 text-xs'}
              type={'checkbox'}
              onChange={handleChange}
              checked={isChecked(service.id)}
            />
            {service.name}
          </label>
        );
      })}
    </>
  );
};
