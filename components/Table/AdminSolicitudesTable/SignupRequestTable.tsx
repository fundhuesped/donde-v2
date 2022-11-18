import React, { useEffect, useState } from 'react';

import axios from 'axios';
import useSWR from 'swr';
import { SignupRequest, SignupRequests, signupRequestsSchema } from '../../../model/signup';
import { Search } from '../../Search';
import { TableBody } from './SignupRequestsTableBody';
import TableHead from './TableHead';

type Props = React.PropsWithChildren<{
  className?: string;
  title?: string;
  placeholder?: string;
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { title, placeholder } = props;
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const { data, mutate } = useSWR('/api/admin/registros', (url) => axios.get(url).then((res) => res.data));

  const [signupRequests, setSignupRequests] = useState<SignupRequests>([]);
  useEffect(() => {
    if (data) {
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
        <div className="relative">
          <Search
            className={'input-style w-72 lg:w-96 rounded-base h-10 text-sm text-gray-500'}
            iconClassName={'absolute -translate-y-2/4 right-2 lg:rigth-full lg:ml-28 top-1/3 w-5 text-light-gray'}
            placeholder={placeholder}
            name="search"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
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
