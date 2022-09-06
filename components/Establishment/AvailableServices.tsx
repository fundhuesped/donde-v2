import React, { useState } from 'react';
import capitalize from 'lodash/capitalize';
import { Specialty } from '../../model/specialty';

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void;
  availableSpecialties: Specialty[];
  specialties: Set<string>;
  availableServices: { id: string; name: string }[];
};

function ServiceCheckbox(props: {
  specialty: { id: string; name: string | null };
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  checked: boolean;
}) {
  return (
    <label>
      <input
        name={props.specialty.id}
        className={'mr-2 text-xs'}
        type={'checkbox'}
        onChange={props.onChange}
        checked={props.checked}
      />
      {capitalize(props.specialty.name || undefined)}
    </label>
  );
}
const abortRelatedSpecialtiesIds: string[] = [
  '1b9708ec-e418-45ed-8125-27ac44ca5885',
  'f202e2b6-6656-4946-a2c5-ab8ce82a37a6',
  '7ea2785d-ea89-4086-b43c-91f95f506264',
  'dfd8f9da-5488-4cbf-bf22-0009059f85b5',
];
const isAbortRelatedSpecialty = (id: string) => abortRelatedSpecialtiesIds.includes(id);

export const AvailableServices = (props: AvailableServicesProps) => {
  const { specialties, availableSpecialties, availableServices, onChange } = props;
  const hasAnyAbortRelatedSpecialty = Array.from(specialties).some((specialty) => isAbortRelatedSpecialty(specialty));
  const [isAbortChecked, setIsAbortChecked] = useState(hasAnyAbortRelatedSpecialty);
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, checked } = event.currentTarget;
    let updatedServices = new Set(specialties);
    if (checked) {
      updatedServices.add(name);
    } else {
      updatedServices.delete(name);
    }
    onChange({ specialties: updatedServices });
  };
  const isChecked = (serviceId: string) => specialties.has(serviceId);
  const handleAbortCheckboxClick = () => {
    if (isAbortChecked) {
      const abortRelatedSpecialtiesExcluded = Array.from(specialties).filter((specialty) => !isAbortRelatedSpecialty(specialty));
      onChange({ specialties: new Set(abortRelatedSpecialtiesExcluded) });
    }
    setIsAbortChecked(!isAbortChecked);
  };
  const nonAbortRelatedSpecialties = availableSpecialties
    .filter((specialty) => {
      return !isAbortRelatedSpecialty(specialty.id);
    })
    .map((specialty) => {
      const serviceName = availableServices.find((service) => service.id === specialty.serviceId)?.name;
      return { id: specialty.id, name: serviceName || '' };
    });
  const abortRelatedSpecialties = availableSpecialties.filter((specialty) => {
    return isAbortRelatedSpecialty(specialty.id);
  });
  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h1>
      <div className={'flex flex-col'}>
        {nonAbortRelatedSpecialties?.map((specialty) => {
          return (
            <ServiceCheckbox key={specialty.id} specialty={specialty} onChange={handleChange} checked={isChecked(specialty.id)} />
          );
        })}
        <label key={'abortCheckbox'}>
          <input
            name={'abortCheckbox'}
            className={'mr-2 text-xs'}
            type={'checkbox'}
            onChange={handleAbortCheckboxClick}
            checked={isAbortChecked}
          />
          Aborto
        </label>
        {isAbortChecked && (
          <div className={'ml-8 flex flex-col'}>
            {abortRelatedSpecialties.map((specialty) => {
              return (
                <ServiceCheckbox
                  key={specialty.id}
                  specialty={specialty}
                  onChange={handleChange}
                  checked={isChecked(specialty.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
