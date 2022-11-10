import { XIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import useSWR from 'swr';
import { AddEstablishmentButton } from '../../components/Buttons/AddEstablishmentButton';
import DownloadButton from '../../components/Buttons/DownloadButton';
import { ImportEstablishmentButton } from '../../components/Buttons/ImportEstablishmentButton';
import { EstablishmentModel } from '../../components/Establishment/EstablishmentAdmin';
import Loading from '../../components/Loading';
import ImportModal from '../../components/Modal/ImportModal';
import { Pill } from '../../components/Pill';
import { Search } from '../../components/Search';
import Filtros from '../../components/Table/AdminEstablecimientosTable/Filter/Filtros';
import Table from '../../components/Table/AdminEstablecimientosTable/Table';
import { Establishment } from '../../model/establishment';
import { Service, serviceSchema } from '../../model/services';
import { prismaClient } from '../../server/prisma/client';
import styles from '../../styles/app.module.css';
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
  const [importModal, setImportModal] = useState<boolean>(false);
  const [descargarModal, setDescargarModal] = useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>('');
  const [filters, setFilters] = useState<any>(() => new Set<string>());
  const [isLoading, setIsLoading] = useState(false);
  const [pageParam, setPageParam] = useState('per_page=4&page=1');

  const queryFilter = Array.from(filters);
  const [filteredEstablishments, setFilteredEstablishments] = useState<any>([]);

  const onEstablishmentChage = (data: EstablishmentModel[]) => {
    if (data?.length > 0) {
      setPageParam(`id=${data[0].id}&per_page=4&page=1`);
    } else {
      setPageParam(`per_page=4&page=1`);
    }
  };

  const onPaginateChange = (pageNumber: number) => {
    setPageParam(`per_page=4&page=${pageNumber}`);
  };

  const { data: establishments } = useSWR(router.isReady ? '/api/establishments' : null, (url) =>
    axios.get(url, { params: pageParam }).then((res) => res.data),
  );

  useEffect(() => {
    setFilteredEstablishments(
      establishments?.filter((establishment: Establishment) => {
        if (queryFilter.length > 0) {
          return (
            queryFilter.includes(establishment.country) ||
            queryFilter.includes(establishment.type) ||
            establishment.services.filter((service) => queryFilter.includes(service.service.name)).length !== 0
          );
        }
        if (querySearch) {
          return (
            establishment.name.toLowerCase().includes(querySearch.toLowerCase()) ||
            establishment.street.toLowerCase().includes(querySearch.toLowerCase())
          );
        }
        return establishment;
      }),
    );
    onEstablishmentChage(establishments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishments, setFilters, filters, querySearch]);

  const deleteFilter = (filter: string) => {
    setFilters((prev: any) => {
      const next = new Set(prev);
      next.delete(filter);
      return next;
    });
  };
  console.log(pageParam);

  return (
    <>
      <Head>
        <title>Dónde - Establecimientos</title>
      </Head>
      <main className={'px-6 my-2'}>
        <div className="md:w-9/12 mx-auto py-12">
          <div className="flex flex-col lg:flex-row justify-between">
            <h2 className={'text-2xl text-black font-bold mb-8 '}>Establecimientos</h2>
            <div className="flex w-fit">
              <ImportEstablishmentButton onClick={() => setImportModal(true)} />
              <AddEstablishmentButton />
            </div>
          </div>
          <div className="relative flex mt-6 lg:mt-0 lg:justify-end">
            <Search
              placeholder="Buscar por nombre o dirección"
              name="search"
              onChange={(e) => setQuerySearch(e.target.value)}
              className={'input-style w-full ml-0 lg:ml-20 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
              iconClassName={'absolute -translate-y-2/4 right-2 lg:rigth-full lg:ml-28 top-2/4 w-5 text-light-gray'}
            />
          </div>
          <Filtros services={availableServices} setFilters={setFilters} filters={filters} />
          <div className="w-full py-4 flex justify-between ">
            <div className="ml-20 flex flex-wrap w-fit">
              {queryFilter &&
                queryFilter.map((filter: any) => (
                  <>
                    <Pill className={'mb-1 mr-1 flex bg-primary text-white border-none'}>
                      {filter}
                      <button className="inherit" onClick={() => deleteFilter(filter)}>
                        <XIcon className="mr-0 ml-2 text-inherit w-3 p-0 cursor-pointer"></XIcon>
                      </button>
                    </Pill>
                  </>
                ))}
            </div>
            <div className="">
              <DownloadButton onClick={() => setDescargarModal(true)} />
            </div>
          </div>
          <div className="w-full flex justify-center mb-4">{isLoading && <Loading />}</div>
          <Table establishments={filteredEstablishments} setFilteredEstablishments={setFilteredEstablishments} />
          <Pagination
            onChange={onPaginateChange}
            activePage={1}
            itemsCountPerPage={10}
            totalItemsCount={40}
            innerClass={styles.paginateTable}
          />
          {importModal ? <ImportModal showModal={importModal} setShowModal={setImportModal} /> : ''}
          {/* {descargarModal ? <DescargarModal showModal={descargarModal} setShowModal={setDescargarModal} /> : ''} */}
        </div>
      </main>
    </>
  );
};

export default EstablecimientosAdmin;
