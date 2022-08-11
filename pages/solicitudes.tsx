import { NextPage } from 'next';
import { useState } from 'react';
import Table from '../components/Table/Table';
import { TableBody } from '../components/Table/TableBody';
import TableHead from '../components/Table/TableHead';
import { mockSolicitud } from './api/auth/mockSolicitud';

const columns = [
  {
    label: 'Nombre',
    accessor: 'name',
    className: 'py-3 text-left',
  },
  {
    label: 'Apellido',
    accessor: 'lastname',
    className: 'py-3 px-6 text-left',
  },
  {
    label: 'Fecha',
    accessor: 'date',
    className: 'py-3 pr-6 text-center',
    sortable: true,
  },
  {
    label: 'Pais',
    accessor: 'country',
    className: 'py-3 text-left',
  },
  {
    label: 'Estado',
    accessor: 'state',
    className: 'py-3 px-6 text-center',
    sortable: true,
  },
  {
    label: 'Acciones',
    accessor: 'actions',
    className: 'py-3 px-6 text-center',
  },
];

const Solicitudes: NextPage = () => {
  const [tableData, setTableData] = useState(mockSolicitud);

  return (
    <main className={'px-6 my-2'}>
      <Table title={'Solicitudes'} placeholder={'Buscar por nombre o apellido '}>
        <TableHead {...{ columns, tableData, setTableData }} />
        <TableBody {...{ columns, tableData }} />
      </Table>
    </main>
  );
};

export default Solicitudes;
