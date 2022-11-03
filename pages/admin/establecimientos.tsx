import { XIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { AddEstablishmentButton } from '../../components/Buttons/AddEstablishmentButton';
import DownloadButton from '../../components/Buttons/DownloadButton';
import { ImportEstablishmentButton } from '../../components/Buttons/ImportEstablishmentButton';
import { Pill } from '../../components/Pill';
import { Search } from '../../components/Search';
import Filtros from '../../components/Table/AdminEstablecimientosTable/Filtros';
import Table from '../../components/Table/AdminEstablecimientosTable/Table';

const EstablecimientosAdmin: NextPage = () => {
  const router = useRouter();

  const { data: establishments } = useSWR(router.isReady ? '/api/establishments' : null, (url) =>
    axios.get(url).then((res) => res.data),
  );

  

  return (
    <>
      <Head>
        <title>Dónde - Establecimientos</title>
      </Head>
      <main className={'px-6 my-2'}>
        <div className="md:w-9/12 mx-auto py-12">
          <div className="flex flex-row justify-between">
            <h2 className={'text-2xl text-black font-bold mb-8 '}>Establecimientos</h2>
            <div className="flex w-fit">
              <ImportEstablishmentButton/>
              <AddEstablishmentButton/>
            </div>
          </div>
          <div className='relative flex justify-end'>
            <Search 
              placeholder='Buscar por nombre o dirección'
              name="search" 
              // onChange={(e) => setQuery(e.target.value)} 
              className= {'input-style w-full ml-20 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
              iconClassName= {'absolute -translate-y-2/4 right-2 lg:rigth-full lg:ml-28 top-2/4 w-5 text-light-gray'}
            />
          </div>
          <Filtros/>
          <div className='w-full py-4 flex justify-between'>
            <div className='ml-20'>
              <Pill className={'mb-1 mr-1 flex bg-primary text-white border-none'}>Argentina<XIcon className="mr-0 ml-2 text-inherit w-3 p-0 cursor-pointer"></XIcon></Pill>
            </div>
            <div>
              <DownloadButton/>
            </div>
          </div>
          <Table establishments={establishments}/>
        </div>
      </main>
    </>
  );
};

export default EstablecimientosAdmin;