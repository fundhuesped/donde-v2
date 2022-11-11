import React from 'react';
import { EstablishmentModel } from '../../Establishment/EstablishmentAdmin';
import Loading from '../../Loading';
import { TableBody } from './TableBody';
import TableHead from './TableHead';

type Props = React.PropsWithChildren<{
  className?: string;
  establishments: EstablishmentModel[];
  onColumnSort: (x: any) => void;
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props) => {
  const { establishments, onColumnSort } = props;

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
