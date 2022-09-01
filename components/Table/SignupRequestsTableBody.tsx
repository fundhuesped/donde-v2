import { CheckIcon, EyeIcon, XIcon } from '@heroicons/react/solid';
import React, { ReactNode, useState } from 'react';
import { Modal } from '../Modal';
import { SignupRequest, SignupRequests } from '../../model/signup';
import classNames from 'classnames';
import { formatDate } from '../../utils/dates';
import axios from 'axios';
import { OrganizationType } from '@prisma/client';

type Props = React.PropsWithChildren<{
  className?: string;
  filteredSolicitudes: SignupRequests;
  onUpdateData?: () => void;
}>;

type CellProps = {
  children?: ReactNode;
  className?: string;
};
const Cell = React.memo<CellProps>((props) => {
  const { children, className } = props;
  return <td className={classNames('py-3 px-2', className)}>{children}</td>;
});

export const TableBody = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { filteredSolicitudes, onUpdateData } = props;
  const [index, setIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handlerShowModal = (index: number) => {
    setShowModal(true);
    setIndex(index);
  };

  const approveSignupRequest = async (request: SignupRequest) => {
    await axios.post(`/api/admin/registros/${request.userId}/aprobar`);
    onUpdateData?.();
  };

  const rejectSignupRequest = async (request: SignupRequest) => {
    await axios.post(`/api/admin/registros/${request.userId}/rechazar`);
    onUpdateData?.();
  };

  return (
    <>
      <tbody className="text-sm">
        {filteredSolicitudes.map((data, index) => {
          return (
            <tr key={data.userId} className="border-b border-gray-200 hover:bg-gray-100">
              <Cell>{data.firstName}</Cell>
              <Cell>{data.lastName}</Cell>
              <Cell>{formatDate(data.createdAt)}</Cell>
              <Cell>{data.organizationCountry}</Cell>
              <Cell>
                {data.status == 'PENDING' && (
                  <span className="text-white bg-warning py-2 px-3 rounded-full text-sm">Solicitud</span>
                )}
                {data.status == 'ACTIVE' && (
                  <span className="text-white bg-success py-2 px-3 rounded-full text-sm">Aprobada</span>
                )}
                {data.status == 'BLOCKED' && (
                  <span className="text-white bg-danger py-2 px-3 rounded-full text-sm">Rechazada</span>
                )}
              </Cell>
              <Cell className="py-3 text-right flex">
                <button
                  className="btn-primary w-1/3 p-1 flex aling-center justify-center text-sm mr-2 rounded-xl pr-2"
                  type="button"
                  onClick={() => approveSignupRequest(data)}
                >
                  <CheckIcon className="mx-1 mt-0.5 text-inherit w-4"></CheckIcon>
                  Aprobar
                </button>
                <button
                  className="btn-secondary w-1/3 p-1 flex aling-center justify-center text-sm mr-2 rounded-xl pr-2"
                  type="button"
                  onClick={() => rejectSignupRequest(data)}
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
              </Cell>
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
                {filteredSolicitudes[index].firstName} {filteredSolicitudes[index].lastName}
              </h2>
              <ul>
                <li>{filteredSolicitudes[index].email}</li>
                <li>Nombre de la organización: {filteredSolicitudes[index].organizationName}</li>
                <li>País: {filteredSolicitudes[index].organizationCountry}</li>
                <li>Rol: {filteredSolicitudes[index].organizationRole}</li>
                <li>Tipo de organización: {formatOrganizationType(filteredSolicitudes[index].organizationType)}</li>
                <li>Sitio: {filteredSolicitudes[index].organizationWebsite}</li>
              </ul>
            </div>
            <div className="w-full flex justify-end py-3">
              <button
                className="btn-primary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
                type="button"
                onClick={() => {
                  approveSignupRequest(filteredSolicitudes[index]);
                  setShowModal(false);
                }}
              >
                <CheckIcon className="mr-1 mt- mt-0.5 text-inherit w-4"></CheckIcon>
                Aprobar
              </button>
              <button
                className="btn-secondary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
                type="button"
                onClick={() => {
                  rejectSignupRequest(filteredSolicitudes[index]);
                  setShowModal(false);
                }}
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

function formatOrganizationType(type: string) {
  switch (type) {
    case OrganizationType.SOCIAL_ORGANIZATION:
      return 'Organización social';
    case OrganizationType.PRIVATE_INSTITUTION:
      return 'Institución privada';
    case OrganizationType.PUBLIC_INSTITUTION:
      return 'Institución pública';
    default:
      return 'Otro';
  }
}
