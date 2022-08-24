import { NextPage } from 'next';
import Table from '../../components/Table/SignupRequestTable';
import Head from 'next/head';

const Solicitudes: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dónde - Solicitudes de alta</title>
      </Head>
      <main className={'px-6 my-2'}>
        <Table title={'Solicitudes'} placeholder={'Buscar por nombre o apellido '} />
      </main>
    </>
  );
};

export default Solicitudes;
