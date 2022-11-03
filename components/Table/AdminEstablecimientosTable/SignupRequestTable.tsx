import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SignupRequest, SignupRequests, signupRequestsSchema } from '../../../model/signup';
import { AddEstablishmentButton } from '../../Buttons/AddEstablishmentButton';
import { ImportEstablishmentButton } from '../../Buttons/ImportEstablishmentButton';
import { Search } from '../../Search';
import Select from '../../Select';
import { TableBody } from './SignupRequestsTableBody';
import TableHead from './TableHead';

type Props = React.PropsWithChildren<{
  className?: string;
  title?: string;
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { title } = props;
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const { data, mutate } = useSWR('/api/admin/registros', (url) => axios.get(url).then((res) => res.data));

  const [signupRequests, setSignupRequests] = useState<SignupRequests>([]);
  useEffect(() => {
    if (signupRequestsSchema.isValidSync(data)) {
      setSignupRequests(data);
    }
  }, [data]);

  const [filteredSolicitudes, setFilteredSolicitudes] = useState<SignupRequests>([]);

  const handleSorting = (sortField: string, sortOrder: string) => {
    const sortFieldKey = sortField as keyof SignupRequest;
    if (sortField) {
      const sorted = [...filteredSolicitudes].sort((a, b) => {
        const aField = a[sortFieldKey];
        if (aField === undefined || aField === null) {
          return 1;
        }
        const bField = b[sortFieldKey];
        if (bField === undefined || bField === null) {
          return -1;
        }
        return (
          aField.toString().localeCompare(bField.toString(), 'es', {
            numeric: true,
          }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setFilteredSolicitudes(sorted);
    }
  };

  const onColumnSort = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  useEffect(() => {
    setFilteredSolicitudes(
      signupRequests.filter(
        (solicitudes) =>
          solicitudes.firstName.toLowerCase().includes(query.toLowerCase()) ||
          solicitudes.lastName.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }, [signupRequests, setQuery, query]);


  return (
    <div ref={ref} className="md:w-9/12 mx-auto py-12">
      <div className="flex flex-row justify-between">
        <h2 className={'text-2xl text-black font-bold mb-8 '}>{title}</h2>
        <div className="flex w-fit">
          <ImportEstablishmentButton/>
          <AddEstablishmentButton/>
        </div>
      </div>
      <div className='relative flex justify-end'>
        <Search 
          placeholder={'Buscar por nombre o dirección'} 
          name="search" 
          onChange={(e) => setQuery(e.target.value)} 
          className= {'input-style w-full ml-20 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
          iconClassName= {'absolute -translate-y-2/4 right-2 lg:rigth-full lg:ml-28 top-2/4 w-5 text-light-gray'}
        />
      </div>
      <div className='w-full flex'>
        <h4 className={'text-sm text-black mt-10 mr-2'}>Filtros:</h4>
        <Select
          className= {'input-style w-full mr-4   rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
          name={'type'}
          placeholder={'Tipo de establecimiento'}
          onSelect={()=>""}
          value={""}
          items={{ one: ""}}
        />
        <Select
          className= {'input-style w-full mr-4 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
          name={'type'}
          placeholder={'Servicio'}
          onSelect={()=>""}
          value={""}
          items={{ one: ""}}
        />
        <Select
          className= {'input-style w-full mr-4 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
          name={'type'}
          placeholder={'País'}
          onSelect={()=>""}
          value={""}
          items={{ one: ""}}
        />
      </div>
      <div className="table w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <TableHead onColumnSort={onColumnSort} />
          <TableBody filteredSolicitudes={filteredSolicitudes} onUpdateData={() => mutate()} />
        </table>
      </div>
    </div>
  );
});
export default Table;
