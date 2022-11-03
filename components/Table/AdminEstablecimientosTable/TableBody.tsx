import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { OrganizationType } from '@prisma/client';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { SERVICE_ICONS } from '../../../config/services';
import { Establishment } from '../../../model/establishment';
import { ServiceIcon } from '../../../model/services';
import { Icon } from '../../Icon';

type Props = React.PropsWithChildren<{
  className?: string;
  establishments: Establishment[];
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
  const { establishments } = props;
  

  return (
    <>
      <tbody className="text-sm text-black">
        {establishments && establishments.map((establishment, index) => {
          return (
            <tr key={establishment.id} className="border-b border-gray-200 hover:bg-gray-100">
              <Cell>{establishment.name}</Cell>
              <Cell>{establishment.street} {establishment.streetNumber}</Cell>
              <Cell>{establishment.city}</Cell>
              <Cell>
                <div className='flex'>{establishment.services.map(service=>{
                  return (<Icon size="medium" type="tertiary" icon={SERVICE_ICONS[service.service.icon as ServiceIcon]} />)
                  })}
                </div>
              </Cell>
              <Cell> {establishment.country} </Cell>
              <Cell className="py-3 text-right flex">
                  <>
                  <button className="btn-secondary w-fit p-1 flex aling-center justify-center text-sm mr-2 rounded-xl" type="button">
                        <PencilIcon className="text-primary w-6 h-6 p-1 mr-1" />
                        <span className="mr-2 mt-0.5">Editar</span>
                   </button>
                    <button
                      className="inherit w-1/3 flex aling-center justify-center text-sm"
                      type="button"
                      onClick={() => ""}
                    >
                      <TrashIcon className="mx-1 text-primary w-5 mt-1.5"></TrashIcon>
                    </button>
                  </>
              </Cell>
            </tr>
          );
        })}
      </tbody>
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
