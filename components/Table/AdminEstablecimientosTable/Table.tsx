import React, { useState } from 'react';
import { EstablishmentModel } from '../../Establishment/EstablishmentAdmin';
import Loading from '../../Loading';
import { TableBody } from './TableBody';
import TableHead from './TableHead';

type Props = React.PropsWithChildren<{
  className?: string;
  establishments: EstablishmentModel[];
  setFilteredEstablishments: (x: any) => void;
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props) => {
  const { establishments, setFilteredEstablishments } = props;
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSorting = (sortField: string, sortOrder: string) => {
    const sortFieldKey = sortField as keyof EstablishmentModel;

    if (sortField) {
      const sorted = [...establishments].sort((a, b) => {
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
      setFilteredEstablishments(sorted);
    }
  };

  const onColumnSort = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return establishments != null ? (
    <div className="table-auto w-full mb-12 lg:mb-0 lg:max-h-[calc(100vh_-_310px)] overflow-x-auto lg:overflow-x-hidden overflow-y-auto scroll-style">
      <table className="w-full text-sm text-left text-gray-500">
        <TableHead onColumnSort={onColumnSort} />
        <TableBody establishments={establishments} />
      </table>
    </div>
  ) : (
    <div className="flex justify-center p-6">
      <Loading></Loading>
    </div>
  );
});

export default Table;
