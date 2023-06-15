import React from 'react';
import { Service } from '../../../../model/services';
import MultipleSelect from './MultipleSelect';
import countries, { establishmentTypes } from './types';
import Select from '../../../Select';
import { establishmentStatuses } from '../../../../model/establishment';

type Props = React.PropsWithChildren<{
  services: Service[];
  queryType: Set<string>;
  setQueryType: (x: any) => void;
  queryService: Set<string>;
  setQueryService: (x: any) => void;
  queryCountry: Set<string>;
  setQueryCountry: (x: any) => void;
  queryStatus: string;
  setQueryStatus: (x: any) => void;
}>;

const Filtros = (props: Props) => {
  const { queryService, queryType, setQueryCountry, setQueryService, setQueryType, setQueryStatus, queryCountry, queryStatus, services } = props;
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
      <MultipleSelect className={'mr-2'} items={countries} placeholder={'País'} filters={queryCountry} setFilters={setQueryCountry} />
      <Select
        className={'mr-2 mt-6 input-style w-full rounded-base h-12 right-0 text-sm text-gray-500 right-1'}
        items={{ALL: 'Todos', ...establishmentStatuses}}
        placeholder={'Estado'}
        onSelect={(event) => setQueryStatus(event.currentTarget.value)}
        value={queryStatus}
      />
    </div>
  );
};

export default Filtros;
