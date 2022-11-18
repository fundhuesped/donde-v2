import { CloudDownloadIcon } from '@heroicons/react/outline';
import { CSVLink } from 'react-csv';
import { Establishment } from '../../model/establishment';
import { CSVHeaders, formatEstablishmentsForExport } from '../../scripts/exportDataToCSV';

type Props = React.PropsWithChildren<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  filteredEstablishments: Establishment[];
}>;

const DownloadButton = (props: Props) => {
  const { filteredEstablishments } = props;
  return (
    <CSVLink
      filename={'export-establishment.csv'}
      //@ts-ignore
      data={formatEstablishmentsForExport(filteredEstablishments ? filteredEstablishments : '')}
      headers={CSVHeaders}
      enclosingCharacter={``}
      target="_blank"
      className="flex bg-inherent text-primary border-none text-sm mt-1.5"
    >
      <span className="mr-1 mt-0.5">
        <CloudDownloadIcon className=" w-4 mx-1 text-primary" />
      </span>
      Descargar búsqueda (.csv)
    </CSVLink>
  );
};

export default DownloadButton;
