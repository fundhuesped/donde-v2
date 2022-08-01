import React from "react";

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void,
  services: { id: string, label: string }[],
  availableServices: Set<string>
}
export const AvailableServices = (props: AvailableServicesProps) => {
  const {availableServices, services, onChange} = props
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {name, checked} = event.currentTarget
    let updatedServices = new Set(availableServices)
    if (checked) {
      updatedServices.add(name)
    } else {
      updatedServices.delete(name)
    }
    onChange({availableServices: updatedServices})
  }
  const isChecked = (serviceId: string) => availableServices.has(serviceId)

  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h1>
      {services?.map(service => {
        return (
          <label>
            <input
              key={service.id}
              name={service.id}
              className={'mr-2 text-xs'}
              type={'checkbox'}
              onClick={handleChange}
              checked={isChecked(service.id)}
            />
            {service.label}
          </label>)
      })}
    </>
  );
}
