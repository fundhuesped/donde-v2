// import { CSVHeaders, formatEstablishmentsForExport } from 'scripts/exportDataToCSV';
import { EstablishmentModel } from '../Establishment/EstablishmentAdmin';

type Props = React.PropsWithChildren<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  filteredEstablishments: EstablishmentModel[];
}>;

const DownloadButton = (props: Props) => {
  const { filteredEstablishments } = props;
  return (
    // <CSVLink
    //   filename={'export-establishment.csv'}
    //   data={filteredEstablishments}
    //   // data={formatEstablishmentsForExport(filteredEstablishments)}
    //   // headers={CSVHeaders}
    //   target="_blank"
    //   className="flex bg-inherent text-primary border-none text-sm mt-1.5"
    // >
    //   <span className="mr-1 mt-0.5">
    //     <CloudDownloadIcon className=" w-4 mx-1 text-primary" />
    //   </span>
    //   Descargar búsqueda (.csv)
    // </CSVLink>
    <></>
  );
};

export default DownloadButton;
