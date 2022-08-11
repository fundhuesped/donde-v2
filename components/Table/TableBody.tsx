import { CheckIcon, EyeIcon, XIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { Modal } from '../Modal';

interface tableDataI {
  name: string;
  lastname: string;
  date: string;
  country: string;
  state: string;
  id: number;
  mail: string;
  dni: string;
  tel: string;
}

type Props = React.PropsWithChildren<{
  className?: string;
  columns: { label: string; accessor: string; className: string; sortable?: boolean }[];
  tableData: tableDataI[];
}>;

export const TableBody = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, columns, tableData } = props;
  const [index, setIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handlerShowModal = (index: number) => {
    setShowModal(true);
    setIndex(index);
  };

  return (
    <>
      <tbody className="text-sm">
        {tableData.map((data, index) => {
          return (
            <tr key={`id-${data.id}`} className="border-b border-gray-200 hover:bg-gray-100">
              {columns.map(({ accessor, className }) => {
                const columnKey = accessor;
                const columnData = data[accessor as keyof tableDataI];
                if (columnKey == 'state') {
                  return (
                    <td key={`id-${accessor}`} className={className}>
                      {columnData == 'Solicitud' && (
                        <span className="text-white bg-[#E1980A] py-2 px-3 rounded-full text-sm">{columnData}</span>
                      )}
                      {columnData == 'Aprobada' && (
                        <span className="text-white bg-[#49C462] py-2 px-3 rounded-full text-sm">{columnData}</span>
                      )}
                      {columnData == 'Rechazada' && (
                        <span className="text-white bg-[#DB3500] py-2 px-3 rounded-full text-sm">{columnData}</span>
                      )}
                    </td>
                  );
                } else if (accessor == 'actions') {
                  return (
                    <td className="py-3 text-right flex">
                      <button
                        className="btn-primary w-1/3 p-1 flex aling-center justify-center text-sm mr-2"
                        style={{ borderRadius: '12px' }}
                        type="button"
                      >
                        <CheckIcon className="mx-1 mt-[.2em]" style={{ color: 'inherent', width: '1.1em' }}></CheckIcon>
                        Aprobar
                      </button>
                      <button
                        className="btn-secondary w-1/3 p-1 flex aling-center  justify-center text-sm mr-2"
                        style={{ borderRadius: '12px' }}
                        type="button"
                      >
                        <XIcon className="mx-1 mt-[.2em]" style={{ color: 'inherent', width: '1.1em' }}></XIcon>
                        Rechazar
                      </button>
                      <button
                        className=" w-1/3 p-1 flex aling-center"
                        type="button"
                        onClick={() => {
                          handlerShowModal(index);
                        }}
                      >
                        <EyeIcon className="mx-2 mt-[.15em]" style={{ color: '#5A5A67', width: '1.2em' }} /> Detalles
                      </button>
                    </td>
                  );
                } else {
                  return (
                    <td key={`id-${accessor}`} className={className}>
                      {data[accessor as keyof tableDataI]}
                    </td>
                  );
                }
              })}
            </tr>
          );
        })}
      </tbody>
      {showModal ? (
        <Modal showModal={showModal} background={'rgba(50, 50, 57, 0.7)'}>
          <div className="w-full flex justify-end">
            <button onClick={() => setShowModal(false)}>
              <XIcon className="mr-4 mt-4" style={{ color: '#e6334c', width: '1.5em' }}></XIcon>
            </button>
          </div>
          <div className="flex items-left justify-center flex-col px-[2rem] pb-[1.5rem] rounded-b">
            <div className="w-full">
              <h2 className="text-lg font-semibold py-2" style={{ fontSize: '24px', color: '#323239' }}>
                {tableData[index].name} {tableData[index].lastname}
              </h2>
              <ul>
                <li>{tableData[index].mail}</li>
                <li>{tableData[index].dni}</li>
                <li>{tableData[index].tel}</li>
                <li>{tableData[index].country}</li>
              </ul>
            </div>
            <div className="w-full flex justify-end py-3">
              <button
                className="btn-primary w-1/3 p-1 flex justify-center aling-center text-sm mr-2"
                style={{ borderRadius: '12px' }}
                type="button"
              >
                <CheckIcon className="mr-1 mt-[.2em]" style={{ color: 'inherent', width: '1.1em' }}></CheckIcon>
                Aprobar
              </button>
              <button
                className="btn-secondary w-1/3 p-1 flex justify-center aling-center text-sm mr-2"
                style={{ borderRadius: '12px' }}
                type="button"
                onClick={() => setShowModal(false)}
              >
                <XIcon className="mr-1 mt-[.2em]" style={{ color: 'inherent', width: '1.1em' }}></XIcon>
                Rechazar
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
});
