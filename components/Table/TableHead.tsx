import React, { useState } from 'react';
import { SortTableArrows } from './SortTableArrows';

interface tableDataI {
  name: string;
  lastname: string;
  date: string;
  country: string;
  state: string;
  id: number;
  mail: string;
  dni: string;
  tel: string;
}

type Props = React.PropsWithChildren<{
  className?: string;
  columns: { label: string; accessor: string; className: string; sortable?: boolean }[];
  tableData: tableDataI[];
  setTableData: any;
}>;

const TableHead = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, columns, tableData, setTableData } = props;
  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSorting = (sortField: string, sortOrder: string) => {
    const sortFieldKey = sortField as keyof tableDataI;
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortFieldKey] === null) return 1;
        if (b[sortFieldKey] === null) return -1;
        if (a[sortFieldKey] === null && b[sortFieldKey] === null) return 0;
        return (
          a[sortFieldKey].toString().localeCompare(b[sortFieldKey].toString(), 'es', {
            numeric: true,
          }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  const handleSortingChange = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <>
      <thead>
        <tr className="text-sm text-gray-700 font-light">
          {columns.map(({ label, accessor, className, sortable }) => {
            return (
              <th key={`id-${accessor}`} className={className}>
                {sortable ? (
                  <div className="flex aling-center justify-center">
                    {label}
                    <button className="ml-2" onClick={() => handleSortingChange(accessor)}>
                      <SortTableArrows />
                    </button>
                  </div>
                ) : (
                  label
                )}
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
});
export default TableHead;
