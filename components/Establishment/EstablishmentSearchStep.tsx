import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Button } from '../Button';
type EstablishmentSearchStepProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  name: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  onClick: () => void;
};

export const EstablishmentSearchStep = React.forwardRef<HTMLInputElement, EstablishmentSearchStepProps>(
  (props: EstablishmentSearchStepProps, ref) => {
    const { onChange, onClick, name, address, location } = props;
    const [canValidate, setCanValidate] = useState(false);
    useEffect(() => {
      const validationFields = [name, address, location];
      setCanValidate(validationFields.every((field) => !isEmpty(field)));
    }, [name, address, location]);
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
        <Button className={'w-full my-5'} disabled={!canValidate} type={'primary'} onClick={onClick}>
          Continuar
        </Button>
      </>
    );
  },
);
