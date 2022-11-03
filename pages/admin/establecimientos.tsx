import { NextPage } from 'next';
import Head from 'next/head';
import Table from '../../components/Table/AdminEstablecimientosTable/SignupRequestTable';

const EstablecimientosAdmin: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dónde - Establecimientos</title>
      </Head>
      <main className={'px-6 my-2'}>
        <Table title={'Establecimientos'} />
      </main>
    </>
  );
};

export default EstablecimientosAdmin;