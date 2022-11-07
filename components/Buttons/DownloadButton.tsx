import { CloudDownloadIcon } from '@heroicons/react/outline';
type Props = React.PropsWithChildren<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}>;
const DownloadButton = (props:Props) => {
  const {onClick}=props;
  return (
     <button
            onClick={onClick}
            className="flex bg-inherent text-primary border-none text-sm mt-1.5"
            >
            <span className="mr-1 mt-0.5">
                <CloudDownloadIcon className=" w-4 mx-1 text-primary" />
            </span>
            Descargar búsqueda
    </button>
  )
}

export default DownloadButton