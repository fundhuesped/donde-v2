import isNil from 'lodash/isNil';
import React, { useEffect, useState } from 'react';
import { Button } from '../Button';
type EstablishmentSearchStepProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  onClick: () => void;
  searchLocationParam?: string | string[];
};

export const EstablishmentSearchStep = React.forwardRef<HTMLInputElement, EstablishmentSearchStepProps>(
  (props: EstablishmentSearchStepProps, ref) => {
    const { onChange, onClick, name, address, latitude, longitude, searchLocationParam } = props;
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      const validationFields = [name, address, latitude, longitude];
      setIsValid(validationFields.every((field) => !isNil(field)));
    }, [name, address, latitude, longitude]);

    useEffect(() => {
      if (searchLocationParam) {
        onChange({ currentTarget: { value: searchLocationParam as string, name: 'address' } });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <input
          name={'name'}
          className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
          placeholder={'Nombre del establecimiento'}
          onChange={onChange}
          value={name}
        />
        <input
          ref={ref}
          name={'address'}
          className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-4 mb-4'}
          placeholder={'Dirección del establecimiento'}
          onChange={onChange}
          value={address}
        />
        <Button className={'w-full my-5'} disabled={!isValid} type={'primary'} onClick={onClick}>
          Continuar
        </Button>
      </>
    );
  },
);
