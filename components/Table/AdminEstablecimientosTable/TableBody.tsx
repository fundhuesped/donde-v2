import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { SERVICE_ICONS } from '../../../config/services';
import { ServiceIcon } from '../../../model/services';
import { EstablishmentModel } from '../../Establishment/EstablishmentAdmin';
import { Icon } from '../../Icon';
import EditModal from '../../Modal/EditModal';

type Props = React.PropsWithChildren<{
  className?: string;
  establishments: EstablishmentModel[];
}>;

type CellProps = {
  children?: ReactNode;
  className?: string;
};
const Cell = React.memo<CellProps>((props) => {
  const { children, className } = props;
  return <td className={classNames('py-3 px-2', className)}>{children}</td>;
});

export const TableBody = (props: Props) => {
  const { establishments } = props;
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const deleteEstablishment = async (establishmentId?: string) => {
    if (establishmentId) {
      try {
        await axios.delete(`/api/establishments/${establishmentId}`).then((resp) => {
          router.reload();
        });
      } catch (e: any) {
        setError(true);
      }
    }
  };

  return (
    <>
      <tbody className="text-sm text-black">
        {error && <p className="text-primary font-semibold text-sm">Hubo error en el servidor</p>}
        {establishments &&
          establishments.map((establishment, index) => {
            return (
              <tr key={establishment.id} className="border-b border-gray-200 hover:bg-gray-100">
                <Cell>{establishment.name}</Cell>
                <Cell>
                  {establishment.street} {establishment.streetNumber}
                </Cell>
                <Cell>{establishment.city}</Cell>
                <Cell>{establishment.province}</Cell>
                <Cell>
                  <div className="flex">
                    {establishment.services.map((service) => {
                      return (
                        <div key={service.id} className="relative flex flex-col items-center group">
                          <Icon size="medium" type="tertiary" icon={SERVICE_ICONS[service.service.icon as ServiceIcon]} />
                          <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">
                              {service.service.name}
                            </span>
                            <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Cell>
                <Cell> {establishment.country} </Cell>
                <Cell className="py-3 text-right flex">
                  <>
                    <Link href={`/establecimientos/editar/${establishment.id}`}>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <div className="w-fit p-1 flex aling-center justify-center text-sm mr-2 rounded-xl cursor-pointer border border-primary">
                        <PencilIcon className="text-primary w-6 h-6 p-1 mr-1" />
                        <span className="mr-2 mt-0.5 text-primary">Editar</span>
                      </div>
                    </Link>
                    <button
                      className="inherit w-1/3 flex aling-center justify-center text-sm"
                      type="button"
                      onClick={() => deleteEstablishment(establishment.id)}
                    >
                      <TrashIcon className="mx-1 text-primary w-5 mt-1.5"></TrashIcon>
                    </button>
                  </>
                </Cell>
                {showModal ? <EditModal establishment={establishment} showModal={showModal} setShowModal={setShowModal} /> : ''}
              </tr>
            );
          })}
      </tbody>
    </>
  );
};
