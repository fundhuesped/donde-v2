import React, { useEffect, useState } from 'react';
import { mockSolicitud } from '../../pages/api/auth/mockSolicitud';
import { Search } from '../Search';
import { TableBody } from './SignupRequestsTableBody';
import TableHead from './TableHead';

type SignupRequest = {
  name: string;
  lastname: string;
  date: string;
  country: string;
  state: string;
  id: number;
  mail: string;
  dni: string;
  tel: string;
};

type Props = React.PropsWithChildren<{
  className?: string;
  title?: string;
  placeholder?: string;
  columns: { label: string; accessor: string; className: string; sortable?: boolean }[];
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { columns, title, placeholder } = props;
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');
  const [filteredSolicitudes, setFilteredSolicitudes] = useState(mockSolicitud);

  const search = (searchVal = '') => {
    return [...mockSolicitud].filter(
      (solicitudes) =>
        solicitudes.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
        solicitudes.lastname?.toLowerCase().includes(searchVal.toLowerCase()),
    );
  };

  const handleSorting = (sortField: string, sortOrder: string) => {
    const sortFieldKey = sortField as keyof SignupRequest;
    if (sortField) {
      const sorted = [...filteredSolicitudes].sort((a, b) => {
        if (a[sortFieldKey] === null) return 1;
        if (b[sortFieldKey] === null) return -1;
        if (a[sortFieldKey] === null && b[sortFieldKey] === null) return 0;
        return (
          a[sortFieldKey].toString().localeCompare(b[sortFieldKey].toString(), 'es', {
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
    setFilteredSolicitudes(search(query));
  }, [setQuery, query]);

  return (
    <div ref={ref} className="md:w-9/12 mx-auto py-12">
      <div className="flex flex-row justify-between">
        <h2 className={'text-2xl text-black font-bold mb-8 '}>{title}</h2>
        <Search placeholder={placeholder} name="search" onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="table w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <TableHead {...{ columns, onColumnSort }} />
          <TableBody {...{ columns, filteredSolicitudes }} />
        </table>
      </div>
    </div>
  );
});
export default Table;
