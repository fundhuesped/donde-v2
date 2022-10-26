import React, { useEffect, useState } from 'react';
import { Search } from '../Search';
import { TableBody } from './SignupRequestsTableBody';
import TableHead from './TableHead';
import { SignupRequest, SignupRequests, signupRequestsSchema } from '../../model/signup';
import axios from 'axios';
import useSWR from 'swr';

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
    if (signupRequestsSchema.isValidSync(data)) {
      setSignupRequests(data);
    }
  }, [data]);

  const [filteredSolicitudes, setFilteredSolicitudes] = useState<SignupRequests>([]);

  const handleSorting = (sortField: string, sortOrder: string) => {
    const sortFieldKey = sortField as keyof SignupRequest;
    if (sortField) {
      const sorted = [...filteredSolicitudes].sort((a, b) => {
        if (a[sortFieldKey] === null) return 1;
        if (b[sortFieldKey] === null) return -1;
        if (a[sortFieldKey] === null && b[sortFieldKey] === null) return 0;
        const aField = a[sortFieldKey];
        if (aField === undefined) {
          return 1;
        }
        const bField = b[sortFieldKey];
        if (bField === undefined) {
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
        <Search placeholder={placeholder} name="search" onChange={(e) => setQuery(e.target.value)} />
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
