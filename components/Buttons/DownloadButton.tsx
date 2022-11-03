import { CloudDownloadIcon } from '@heroicons/react/outline'
const DownloadButton = () => {
  return (
     <button
            onClick={()=>""}
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