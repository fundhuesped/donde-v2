import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Establishment } from '../../../model/establishment';
import { SignupRequest, SignupRequests, signupRequestsSchema } from '../../../model/signup';
import { TableBody } from './TableBody';
import TableHead from './TableHead';

type Props = React.PropsWithChildren<{
  className?: string;
  establishments: Establishment[];
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { establishments} = props;
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
      <div className="table w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <TableHead onColumnSort={onColumnSort} />
          <TableBody establishments={establishments} />
        </table>
      </div>
  );
});
export default Table;