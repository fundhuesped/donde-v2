import { CloudUploadIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

export const ImportEstablishmentButton = () => {
  const router = useRouter();
  return (
    <button className="mr-6 flex bg-inherent text-primary border-none text-sm mt-1.5">
      <span className="mr-1 mt-0.5">
        <CloudUploadIcon className=" w-4 mx-1 text-primary" />
      </span>
      Importar base
    </button>
  );
};
