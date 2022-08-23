import { CheckIcon, EyeIcon, XIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { Modal } from '../Modal';

type SignupRequest = {
  name: string;
  lastname: string;
  date: string;
  country: string;
  state: string;
  id: number;
  mail: string;
  dni: string;
  tel: string;
};

type Props = React.PropsWithChildren<{
  className?: string;
  columns: { label: string; accessor: string; className: string; sortable?: boolean }[];
  filteredSolicitudes: SignupRequest[];
}>;

export const TableBody = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, columns, filteredSolicitudes } = props;
  const [index, setIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handlerShowModal = (index: number) => {
    setShowModal(true);
    setIndex(index);
  };

  return (
    <>
      <tbody className="text-sm">
        {filteredSolicitudes.map((data, index) => {
          return (
            <tr key={`id-${data.id}`} className="border-b border-gray-200 hover:bg-gray-100">
              {columns.map(({ accessor, className }) => {
                const columnKey = accessor;
                const columnData = data[accessor as keyof SignupRequest];
                if (columnKey == 'state') {
                  return (
                    <td key={`id-${accessor}`} className={className}>
                      {columnData == 'Solicitud' && (
                        <span className="text-white bg-warning py-2 px-3 rounded-full text-sm">{columnData}</span>
                      )}
                      {columnData == 'Aprobada' && (
                        <span className="text-white bg-success py-2 px-3 rounded-full text-sm">{columnData}</span>
                      )}
                      {columnData == 'Rechazada' && (
                        <span className="text-white bg-danger py-2 px-3 rounded-full text-sm">{columnData}</span>
                      )}
                    </td>
                  );
                } else if (accessor == 'actions') {
                  return (
                    <td className="py-3 text-right flex">
                      <button
                        className="btn-primary w-1/3 p-1 flex aling-center justify-center text-sm mr-2 rounded-xl pr-2"
                        type="button"
                      >
                        <CheckIcon className="mx-1 mt-0.5 text-inherit w-4"></CheckIcon>
                        Aprobar
                      </button>
                      <button
                        className="btn-secondary w-1/3 p-1 flex aling-center justify-center text-sm mr-2 rounded-xl pr-2"
                        type="button"
                      >
                        <XIcon className="mx-1 mt-0.5 text-inherit w-4"></XIcon>
                        Rechazar
                      </button>
                      <button
                        className=" w-1/3 p-1 flex aling-center"
                        type="button"
                        onClick={() => {
                          handlerShowModal(index);
                        }}
                      >
                        <EyeIcon className="mx-2 my-0.5 text-dark-gray w-4" /> Detalles
                      </button>
                    </td>
                  );
                } else {
                  return (
                    <td key={`id-${accessor}`} className={className}>
                      {data[accessor as keyof SignupRequest]}
                    </td>
                  );
                }
              })}
            </tr>
          );
        })}
      </tbody>
      {showModal ? (
        <Modal showModal={showModal} className={'bg-neutral-600/50'}>
          <div className="w-full flex justify-end">
            <button onClick={() => setShowModal(false)}>
              <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
            </button>
          </div>
          <div className="flex items-left justify-center flex-col px-8 pb-6 rounded-b">
            <div className="w-full">
              <h2 className="text-2xl font-semibold py-2 text-black">
                {filteredSolicitudes[index].name} {filteredSolicitudes[index].lastname}
              </h2>
              <ul>
                <li>{filteredSolicitudes[index].mail}</li>
                <li>{filteredSolicitudes[index].dni}</li>
                <li>{filteredSolicitudes[index].tel}</li>
                <li>{filteredSolicitudes[index].country}</li>
              </ul>
            </div>
            <div className="w-full flex justify-end py-3">
              <button className="btn-primary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl" type="button">
                <CheckIcon className="mr-1 mt- mt-0.5 text-inherit w-4"></CheckIcon>
                Aprobar
              </button>
              <button
                className="btn-secondary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
                type="button"
                onClick={() => setShowModal(false)}
              >
                <XIcon className="mr-1 mt- mt-0.5 text-inherit w-4"></XIcon>
                Rechazar
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
});
