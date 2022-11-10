import { InformationCircleIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { Modal } from '../Modal';

type Props = React.PropsWithChildren<{
  showModal?: boolean;
  setShowModal: (x: any) => void;
}>;
const DescargarModal = (props: Props) => {
  const { showModal, setShowModal } = props;
  return (
    <Modal bg={'bg-white'} width={'w-[32rem]'} rounded={'rounded-md'} showModal={showModal} className={'bg-neutral-600/50 '}>
      <div className="w-full flex justify-end ">
        <button onClick={() => setShowModal(false)}>
          <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
        </button>
      </div>
      <div className="flex items-left justify-center flex-col px-12 py-1 pb-12 rounded-b ">
        <div className="w-full">
          <h2 className="text-2xl font-semibold py-2 text-black">Descargar criterios de la búsqueda</h2>
          <ul>
            <li className="text-sm font-normal py-2">Formato:</li>
            <li className="flex items-center">
              <input
                id="default-radio-1"
                type="radio"
                value=""
                name="default-radio"
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2 "
              />
              <label htmlFor="default-radio-1" className="ml-2 text-sm text-gray-900">
                XLS
              </label>
            </li>
            <li className="flex items-center">
              <input
                id="default-radio-2"
                type="radio"
                value=""
                name="default-radio"
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2 "
              />
              <label htmlFor="default-radio-2" className="ml-2 text-sm text-gray-900">
                CSV
              </label>
            </li>
            <li className="flex items-center">
              <input
                id="default-radio-3"
                type="radio"
                value=""
                name="default-radio"
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2 "
              />
              <label htmlFor="default-radio-3" className="ml-2 text-sm text-gray-900">
                XML
              </label>
            </li>
          </ul>
          <p className={'flex justify-between my-4 p-2 bg-ultra-light-salmon rounded-2xl '}>
            <InformationCircleIcon className="w-6 text-primary mx-3" />
            <span className="font-light text-sm">
              Si no aplicó ningún filtro, se descargará la base de establacimientos completa.
            </span>
          </p>
        </div>
        <div className="w-full flex justify-center py-3">
          <button
            className="btn-secondary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
            type="button"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancelar
          </button>
          <button
            className="btn-primary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
            type="button"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Descargar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DescargarModal;
