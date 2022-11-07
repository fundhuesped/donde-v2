import { DocumentTextIcon, PaperClipIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { Modal } from '../Modal';

type Props = React.PropsWithChildren<{
  showModal?: boolean;
  setShowModal: (x:any) => void;
}>;
const ImportModal = (props:Props) => {
    const {showModal, setShowModal} = props;
  return (
     <Modal bg={'bg-white'} width={'w-[32rem]'} rounded={'rounded-md'} showModal={showModal} className={'bg-neutral-600/50 '}>
          <div className="w-full flex justify-end ">
            <button onClick={() => setShowModal(false)}>
              <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
            </button>
          </div>
          <div className="flex items-left justify-center flex-col px-12 py-1 pb-8 rounded-b ">
            <div className="w-full">
                <h2 className="text-2xl font-semibold py-3 text-black">
                 Importar base de establecimientos
                </h2>
                <div className='my-3 flex justify-between'>
                     <button
                        className="btn-secondary w-fit flex justify-center aling-center text-sm mr-2 rounded-xl p2"
                        type="button"
                        onClick={() => {
                        setShowModal(false);
                        }}
                    >
                       <PaperClipIcon className="mr-1 mt-0.5 text-inherit w-4"/> Adjuntar archivo
                    </button>
                        <p className='italic text-sm font-light font-sans mt-2'>
                            Formatos permitidos: CSV / XML
                        </p>
                   
                </div>
                <div className='flex justify-between my-8'>
                    <p
                        className="w-fit flex justify-center aling-center text-sm mr-2 rounded-xl p2"
                    >
                       <DocumentTextIcon className="mr-1 text-inherit w-4"/> Nombre_archivo_base_adjuntada.csv
                    </p>
                    <button onClick={() => setShowModal(false)}>
                        <XIcon className="mr-4 w-4.5"></XIcon>
                    </button>
                </div>
                {/* <p className={'flex justify-between my-4 p-2 bg-ultra-light-salmon rounded-2xl '}>
                    <InformationCircleIcon className='w-6 text-primary mx-3'/> 
                    <span className='font-light text-sm'>Si no aplicó ningún filtro, se descargará la base de establacimientos completa.</span> 
                </p> */}
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
               Importar
              </button>
            </div>
          </div>
        </Modal>
  )
}

export default ImportModal