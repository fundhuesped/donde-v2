import { NextPage } from 'next';
import Head from 'next/head';
import Table from '../../components/Table/AdminSolicitudesTable/SignupRequestTable';

const Usuaries: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dónde - Usuaries</title>
      </Head>
      <main className={'px-6 my-2'}>
        <Table title={'Usuaries'} placeholder={'Buscar por nombre o apellido '} />
      </main>
    </>
  );
};

export default Usuaries;
