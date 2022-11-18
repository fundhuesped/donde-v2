import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { SortTableArrows } from './SortTableArrows';

type Props = React.PropsWithChildren<{
  onColumnSort: (accessor: string) => void;
}>;

type ColumnHeaderProp = {
  children?: ReactNode;
  className?: string;
  onColumnSort?: () => void;
};
const ColumnHeader = React.memo<ColumnHeaderProp>((props) => {
  const { children, className, onColumnSort } = props;
  return (
    <th className={classNames('py-3 px-2', className)}>
      {onColumnSort ? (
        <div className="flex items-center">
          {children}
          <button className="ml-2" onClick={onColumnSort}>
            <SortTableArrows />
          </button>
        </div>
      ) : (
        children
      )}
    </th>
  );
});

const TableHead = (props: Props) => {
  const { onColumnSort } = props;

  return (
    <>
      <thead>
        <tr className="text-sm text-gray-700 font-light">
          <ColumnHeader>Nombre</ColumnHeader>
          <ColumnHeader>Apellido</ColumnHeader>
          <ColumnHeader onColumnSort={() => onColumnSort('createdAt')}>Fecha</ColumnHeader>
          <ColumnHeader>País</ColumnHeader>
          <ColumnHeader onColumnSort={() => onColumnSort('status')}>Estado</ColumnHeader>
          <ColumnHeader className={'text-center'}>Acciones</ColumnHeader>
        </tr>
      </thead>
    </>
  );
};
export default TableHead;
