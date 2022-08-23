import React from 'react';
import { SortTableArrows } from './SortTableArrows';

type Props = React.PropsWithChildren<{
  columns: { label: string; accessor: string; className: string; sortable?: boolean }[];
  onColumnSort: (accessor: string) => void;
}>;

const TableHead = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { columns, onColumnSort } = props;

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
                    <button className="ml-2" onClick={() => onColumnSort(accessor)}>
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
