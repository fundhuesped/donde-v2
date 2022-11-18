import React from 'react';
import { Service } from '../../../../model/services';
import MultipleSelect from './MultipleSelect';
import { countries, establishmentTypes } from './types';

type Props = React.PropsWithChildren<{
  services: Service[];
  queryType: Set<string>;
  setQueryType: (x: any) => void;
  queryService: Set<string>;
  setQueryService: (x: any) => void;
  queryCountry: Set<string>;
  setQueryCountry: (x: any) => void;
}>;

const Filtros = (props: Props) => {
  const { queryService, queryType, setQueryCountry, setQueryService, setQueryType, queryCountry, services } = props;

  return (
    <div className="w-full flex flex-col lg:flex-row">
      <h4 className={'text-sm font-medium text-black mt-10 mx-4'}>Filtros:</h4>
      <MultipleSelect
        className={'mr-2'}
        items={establishmentTypes}
        placeholder={'Tipo de establecimiento'}
        filters={queryType}
        setFilters={setQueryType}
      />
      <MultipleSelect
        className={'mr-2'}
        items={services}
        placeholder={'Servicio'}
        filters={queryService}
        setFilters={setQueryService}
      />
      <MultipleSelect className={''} items={countries} placeholder={'País'} filters={queryCountry} setFilters={setQueryCountry} />
    </div>
  );
};

export default Filtros;
