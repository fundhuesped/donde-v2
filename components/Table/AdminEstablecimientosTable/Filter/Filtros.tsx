import React from 'react';
import { Service } from '../../../../model/services';
import { countries } from './countries';
import { establishmentTypes } from './establishmentTypes';
import MultipleSelect from './MultipleSelect';

type Props = React.PropsWithChildren<{
  services: Service[];
  filters: Set<string>;
  setFilters: (x: any) => void;
}>;

const Filtros = (props: Props) => {
  const { filters, setFilters, services } = props;

  return (
    <div className="w-full flex flex-col lg:flex-row">
      <h4 className={'text-sm font-medium text-black mt-10 mx-4'}>Filtros:</h4>
      <MultipleSelect
        className={'mr-2'}
        items={establishmentTypes}
        placeholder={'Tipo de establecimiento'}
        filters={filters}
        setFilters={setFilters}
      />
      <MultipleSelect className={'mr-2'} items={services} placeholder={'Servicio'} filters={filters} setFilters={setFilters} />
      <MultipleSelect className={''} items={countries} placeholder={'País'} filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default Filtros;
