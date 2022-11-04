import React from 'react';
import { Service } from '../../../../model/services';
import { countries } from './countries';
import { establishmentTypes } from './establishmentTypes';
import MultipleSelect from './MultipleSelect';

type Props = React.PropsWithChildren<{
  setQueryFilter:  (x:any)=>void;
  queryFilter: [];
  services: Service[];
}>;

const Filtros = (props:Props) => {
  const { setQueryFilter, queryFilter, services} = props;

  return (
    <div className='w-full flex'>
        <h4 className={'text-sm font-medium text-black mt-10 mx-4'}>Filtros:</h4>
          <MultipleSelect 
            className={'mr-2'} 
            items={establishmentTypes}
            placeholder={'Tipo de establecimiento'}
            setQueryFilter={setQueryFilter}
            queryFilter={queryFilter}
          />
          <MultipleSelect 
            className={'mr-2'} 
            items={services}
            placeholder={'Servicio'}
            setQueryFilter={setQueryFilter}
            queryFilter={queryFilter}
          />
          <MultipleSelect 
            className={''} 
            items={countries}
            placeholder={'País'}
            setQueryFilter={setQueryFilter}
            queryFilter={queryFilter}
          />
    </div>
  )
}

export default Filtros