import { CheckIcon, DocumentTextIcon, InformationCircleIcon, PaperClipIcon, XIcon } from '@heroicons/react/outline';
import axios from 'axios';
import React, { useState } from 'react';
import Loading from '../Loading';
import { Modal } from '../Modal';

type Props = React.PropsWithChildren<{
  showModal?: boolean;
  setShowModal: (x: any) => void;
}>;
const ImportModal = (props: Props) => {
  const { showModal, setShowModal } = props;
  // @ts-ignore
  const [file, setFile] = useState<{ data }>();
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;
    if (eventTarget.files?.length) {
      setFile({ data: eventTarget.files[0] });
      setName(eventTarget.files[0].name);
    }
  };

  const deleteFile = () => {
    setName('');
  };

  const save = async () => {
    const formData = new FormData();

    if (file) {
      formData.append('file', file.data);
    } else {
      setError('Seleccione un archivo');
      return null;
    }

    setLoading(true);

    try {
      await axios.post(`/api/admin/import-establishments`, formData).then((resp) => {
        setError(null);
        setResponse('Import exitoso!');
        setLoading(false);
      });
    } catch (e: any) {
      if (e.response.data.error) {
        setError(e.response.data.error);
      } else {
        setError('Error del servidor, vuelva a intentarlo');
      }
      setLoading(false);
    }
  };

  return (
    <Modal bg={'bg-white'} width={'w-[32rem]'} rounded={'rounded-md'} showModal={showModal} className={'bg-neutral-600/50 '}>
      <div className="w-full flex justify-end ">
        <button onClick={() => setShowModal(false)}>
          <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
        </button>
      </div>
      {loading && (
        <div className="w-full flex justify-center p-8 mb-6">
          <Loading />
        </div>
      )}
      {!response && !loading && (
        <div className="flex items-left justify-center flex-col px-12 py-1 pb-8 rounded-b ">
          <div className="w-full">
            <h2 className="text-2xl font-semibold py-3 text-black">Importar base de establecimientos</h2>
            <div className="w-full my-3 flex flex-col lg:flex-row justify-center lg:justify-between">
              <form className="w-fit">
                <label
                  className="w-fit flex aling-center justify-center text-sm mr-2 rounded-xl cursor-pointer border border-primary p-2 text-primary"
                  htmlFor="dropzone-file"
                >
                  <input
                    id="dropzone-file"
                    type={'file'}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className={'hidden'}
                    onChange={onFileChange}
                  />
                  <PaperClipIcon className="mr-1 mt-0.5 text-inherit w-4" /> Adjuntar archivo
                </label>
              </form>
              <p className="w-fit italic text-sm font-light font-sans mt-2">Formatos permitidos: CSV</p>
            </div>
            {name && (
              <div className="flex justify-between my-8">
                <p className="w-fit flex justify-center aling-center text-sm mr-2 rounded-xl p2">
                  <DocumentTextIcon className="mr-1 text-inherit w-4" /> {name}
                </p>
                <button onClick={deleteFile}>
                  <XIcon className="mr-4 w-4.5"></XIcon>
                </button>
              </div>
            )}
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
              onClick={save}
            >
              Importar
            </button>
          </div>
        </div>
      )}
      {response && (
        <div className="w-full h-30 flex justify-center mb-6">
          <p className={'flex justify-between my-4 p-2 bg-green-100 rounded-2xl mx-6'}>
            <CheckIcon className="w-6 text-green-400 mx-3" />
            <span className="font-light text-sm mr-2">{response}</span>
          </p>
        </div>
      )}
      {error && (
        <div className="w-full h-30 flex justify-center mb-6 ">
          <p className={'flex justify-between my-4 p-2 bg-ultra-light-salmon rounded-2xl mx-6'}>
            <InformationCircleIcon className="w-6 text-primary mx-3" />
            <span className="font-light text-sm mr-2">{error}</span>
          </p>
        </div>
      )}
    </Modal>
  );
};

export default ImportModal;
