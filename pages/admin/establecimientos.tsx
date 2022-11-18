import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AddEstablishmentButton } from '../../components/Buttons/AddEstablishmentButton';
import DownloadButton from '../../components/Buttons/DownloadButton';
import { ImportEstablishmentButton } from '../../components/Buttons/ImportEstablishmentButton';
import Loading from '../../components/Loading';
import ImportModal from '../../components/Modal/ImportModal';
import Pagination from '../../components/Pagination';
import Filtros from '../../components/Table/AdminEstablecimientosTable/Filter/Filtros';
import MultipleSearch from '../../components/Table/AdminEstablecimientosTable/Filter/MultipleSearch';
import { establishmentTypes } from '../../components/Table/AdminEstablecimientosTable/Filter/types';
import Table from '../../components/Table/AdminEstablecimientosTable/Table';
import { usePaginator } from '../../hooks/usePaginator';
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
  const [importModal, setImportModal] = useState<boolean>(false);
  // const [descargarModal, setDescargarModal] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>('');
  const [queryStreet, setQueryStreet] = useState<string>('');
  const [queryProvince, setQueryProvince] = useState<string>('');
  const [queryCity, setQueryCity] = useState<string>('');
  const [queryCountry, setQueryCountry] = useState<any>(() => new Set<string>());
  const [queryType, setQueryType] = useState<any>(() => new Set<string>());
  const [queryService, setQueryService] = useState<any>(() => new Set<string>());
  const [filters, setFilters] = useState<any>(() => new Set<string>());
  const [isLoading, setIsLoading] = useState(true);

  const queryFilterCountry = Array.from(queryCountry);
  const queryFilterType = Array.from(queryType);
  const queryFilterService = Array.from(queryService);
  const [filteredEstablishments, setFilteredEstablishments] = useState<any>([]);

  const { data: establishments } = useSWR(router.isReady ? '/api/establishments' : null, (url) =>
    axios.get(url).then((res) => res.data),
  );

  const { items, pages, pagesList, setPageNumber, pageNumber } = usePaginator(filteredEstablishments, 10);

  const setType = (type: string) => {
    const filtered = establishmentTypes.find((types) => types.id == type && types.name);
    return filtered?.name;
  };

  useEffect(() => {
    setFilteredEstablishments(
      establishments?.filter((establishment: Establishment) => {
        setIsLoading(true);
        return (
          establishment.name.includes(queryName) &&
          establishment.street.includes(queryStreet) &&
          establishment.province.includes(queryProvince) &&
          establishment.city.includes(queryCity) &&
          (queryFilterType.length == 0 || queryFilterType.includes(setType(establishment.type))) &&
          (queryFilterService.length == 0 ||
            establishment.services.filter((service) => queryFilterService.includes(service.service.name)).length !== 0) &&
          (queryFilterCountry.length == 0 || queryFilterCountry.includes(establishment.country))
        );
      }),
    );
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishments, queryCountry, queryType, queryService, queryName, queryStreet, queryCity, queryProvince]);

  const deleteFilter = (filter: string) => {
    setFilters((prev: any) => {
      const next = new Set(prev);
      next.delete(filter);
      return next;
    });
  };

  const [sortField, setSortField] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSorting = (sortField: string, sortOrder: string) => {
    const sortFieldKey = sortField as keyof Establishment;

    if (sortField) {
      const sorted = [...establishments].sort((a, b) => {
        const aField = a[sortFieldKey];
        if (aField === undefined || aField === null) {
          return 1;
        }
        const bField = b[sortFieldKey];
        if (bField === undefined || bField === null) {
          return -1;
        }
        return (
          aField.toString().localeCompare(bField.toString(), 'es', {
            numeric: true,
          }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setFilteredEstablishments(sorted);
    }
  };

  const onColumnSort = (accessor: string) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  var totalEstablishment = JSON.stringify(filteredEstablishments?.length);

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
          <MultipleSearch
            setQueryName={setQueryName}
            setQueryStreet={setQueryStreet}
            setQueryProvince={setQueryProvince}
            setQueryCity={setQueryCity}
          />
          <Filtros
            services={availableServices}
            queryType={queryType}
            queryService={queryService}
            queryCountry={queryCountry}
            setQueryType={setQueryType}
            setQueryService={setQueryService}
            setQueryCountry={setQueryCountry}
          />
          <div className="w-full py-4 flex justify-between ">
            {/* <div className="ml-20 flex flex-wrap w-fit">
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
            </div> */}
            <div className="">
              <DownloadButton filteredEstablishments={filteredEstablishments} />
            </div>
          </div>
          <p className="text-gray-600 text-xs mb-2 ">
            Total de establecimientos: <span className="text-gray-800">{totalEstablishment}</span>
          </p>
          <Table establishments={items} onColumnSort={onColumnSort} />
          <div className="w-full flex justify-center mb-4">{isLoading && <Loading />}</div>
          <Pagination pages={pages} pagesList={pagesList} setPageNumber={setPageNumber} pageNumber={pageNumber}></Pagination>
          {importModal ? <ImportModal showModal={importModal} setShowModal={setImportModal} /> : ''}
          {/* {descargarModal ? <DescargarModal showModal={descargarModal} setShowModal={setDescargarModal} /> : ''} */}
        </div>
      </main>
    </>
  );
};

export default EstablecimientosAdmin;
