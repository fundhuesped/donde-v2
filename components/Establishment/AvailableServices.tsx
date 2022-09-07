import React from 'react';
import { SpecialtyWithService } from '../../model/specialty';
import { groupBy, partition } from 'lodash';

type AvailableServicesProps = {
  onChange: (event: { [key: string]: any }) => void;
  availableSpecialties: SpecialtyWithService[];
  activeSpecialties: Set<string>;
};

export const AvailableServices = (props: AvailableServicesProps) => {
  const { activeSpecialties, availableSpecialties, onChange } = props;
  const isChecked = (specialtyId: string) => activeSpecialties.has(specialtyId);
  const removeSpecialties = (specialties: string[]) => {
    const updatedSpecialties = new Set(activeSpecialties);
    specialties.forEach((specialtyId) => updatedSpecialties.delete(specialtyId));
    onChange({ specialties: updatedSpecialties });
  };
  const addSpecialty = (defaultSpecialty: string, selectedSpecialty: string | undefined, otherSpecialties: string[]) => {
    const updatedSpecialties = new Set(activeSpecialties);
    otherSpecialties.forEach((specialtyId) => updatedSpecialties.delete(specialtyId));
    updatedSpecialties.add(defaultSpecialty);
    if (selectedSpecialty) {
      updatedSpecialties.add(selectedSpecialty);
    }
    onChange({ specialties: updatedSpecialties });
  };

  return (
    <>
      <h1 className={'my-6 text-justify font-bold text-black'}>¿Qué servicios brinda el lugar?</h1>
      <ul className={'flex flex-col'}>
        {Object.values(groupBy(availableSpecialties, (specialty) => specialty.service.id)).map((specialties) => {
          const [[defaultSpecialty], otherSpecialties] = partition(specialties, (specialty) => specialty.name === null);
          if (!defaultSpecialty) {
            return null;
          }
          const checked = isChecked(defaultSpecialty.id);
          const selectedSpecialty = otherSpecialties.find((specialty) => activeSpecialties.has(specialty.id));
          return (
            <li key={defaultSpecialty.id}>
              <label className={'cursor-pointer'} htmlFor={`checkbox-${defaultSpecialty.id}`}>
                <input
                  id={`checkbox-${defaultSpecialty.id}`}
                  name={defaultSpecialty.id}
                  className={'cursor-pointer mr-2'}
                  type={'checkbox'}
                  checked={checked}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    if (checked) {
                      addSpecialty(
                        defaultSpecialty.id,
                        selectedSpecialty?.id ?? otherSpecialties[0]?.id,
                        otherSpecialties.map(({ id }) => id),
                      );
                    } else {
                      removeSpecialties(specialties.map(({ id }) => id));
                    }
                  }}
                />
                {defaultSpecialty.service.name}
              </label>
              {otherSpecialties.length > 0 && (
                <select
                  className={'bg-white border border-light-gray rounded ml-2'}
                  defaultValue={selectedSpecialty?.id}
                  onChange={(event) =>
                    addSpecialty(
                      defaultSpecialty.id,
                      event.target.value,
                      otherSpecialties.map(({ id }) => id),
                    )
                  }
                >
                  {otherSpecialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
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
