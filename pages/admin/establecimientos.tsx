import { XIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AddEstablishmentButton } from '../../components/Buttons/AddEstablishmentButton';
import DownloadButton from '../../components/Buttons/DownloadButton';
import { ImportEstablishmentButton } from '../../components/Buttons/ImportEstablishmentButton';
import { EstablishmentModel } from '../../components/Establishment/EstablishmentAdmin';
import DescargarModal from '../../components/Modal/DescargarModal';
import ImportModal from '../../components/Modal/ImportModal';
import { Pill } from '../../components/Pill';
import { Search } from '../../components/Search';
import Filtros from '../../components/Table/AdminEstablecimientosTable/Filter/Filtros';
import Table from '../../components/Table/AdminEstablecimientosTable/Table';
import { Establishment } from '../../model/establishment';
import { Service, serviceSchema } from '../../model/services';
import { prismaClient } from '../../server/prisma/client';

type ServerSideProps = {
  availableServices: Service[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const services = await prismaClient.service.findMany({
    include: {
      subservices: true,
    },
  });
  return {
    props: {
      availableServices: services.map((service) => serviceSchema.validateSync(service)),
    },
  };
};

const EstablecimientosAdmin: NextPage<ServerSideProps> = ({ availableServices }) => {
  const router = useRouter();
  const [filteredEstablishments, setFilteredEstablishments] = useState<EstablishmentModel[]>([]);
  const [querySearch, setQuerySearch] = useState<string>('');
  const [queryFilter, setQueryFilter] = useState<[]>([]);
  const [importModal, setImportModal] = useState<boolean>(false);
  const [descargarModal, setDescargarModal] = useState<boolean>(false);
  const { data: establishments } = useSWR(router.isReady ? '/api/establishments' : null, (url) =>
    axios.get(url).then((res) => res.data),
  );

  useEffect(() => {
    setFilteredEstablishments(
      establishments && establishments.filter(
        (establishment:Establishment) =>
          establishment.name.toLowerCase().includes(querySearch.toLowerCase()) ||
          establishment.street.toLowerCase().includes(querySearch.toLowerCase()),
      ),
    );
  }, [establishments, setQuerySearch, querySearch]);

  useEffect(() => {
    // setFilteredEstablishments(
    //   establishments && establishments.filter(
    //     (establishment:Establishment) =>
    //       establishment.country.includes(queryFilter) ||
    //       establishment.type.includes(queryFilter) ||
    //       establishment.services.map(service=>service.id.includes(queryFilter)),
    //   ),
    // );
    // console.log(queryFilter);

    
  }, [establishments, setQueryFilter, queryFilter]);
  

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
              <ImportEstablishmentButton onClick={()=>setImportModal(true)}/>
              <AddEstablishmentButton/>
            </div>
          </div>
          <div className='relative flex justify-end'>
            <Search 
              placeholder='Buscar por nombre o dirección'
              name="search" 
              onChange={(e) => setQuerySearch(e.target.value)}
              className= {'input-style w-full ml-20 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
              iconClassName= {'absolute -translate-y-2/4 right-2 lg:rigth-full lg:ml-28 top-2/4 w-5 text-light-gray'}
            />
          </div>
          <Filtros setQueryFilter={setQueryFilter} queryFilter={queryFilter} services={availableServices}/>
          <div className='w-full py-4 flex justify-between '>
            <div className='ml-20 flex flex-wrap w-fit'>
              {queryFilter && queryFilter.map(filter=>(
                <>
                <Pill className={'mb-1 mr-1 flex bg-primary text-white border-none'}>{filter}<XIcon className="mr-0 ml-2 text-inherit w-3 p-0 cursor-pointer"></XIcon></Pill>
                <Pill className={'mb-1 mr-1 flex bg-primary text-white border-none'}>{filter}<XIcon className="mr-0 ml-2 text-inherit w-3 p-0 cursor-pointer"></XIcon></Pill>
                <Pill className={'mb-1 mr-1 flex bg-primary text-white border-none'}>{filter}<XIcon className="mr-0 ml-2 text-inherit w-3 p-0 cursor-pointer"></XIcon></Pill>
                </>
              ))}
              
            </div>
            <div className=''>
              <DownloadButton  onClick={()=>setDescargarModal(true)}/>
            </div>
          </div>
          <Table establishments={filteredEstablishments} />
           {importModal ? (<ImportModal showModal={importModal} setShowModal={setImportModal}/> ): ""}
           {descargarModal ? (<DescargarModal showModal={descargarModal} setShowModal={setDescargarModal}/> ): ""}
        </div>
      </main>
    </>
  );
};

export default EstablecimientosAdmin;