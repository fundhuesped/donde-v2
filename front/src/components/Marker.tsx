import React from 'react';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

export type MarkerProps = {
  lat: number;
  lng: number;
  address: string;
  schedule: string;
};

export const Marker = React.memo<MarkerProps>((props) => {
  return (
    <div
      className={classNames('bg-wingu-primary', 'w-20 h-20 p-4')}
      style={{ position: 'absolute', transform: 'translate(-50%, -70%)' }}
    >
      <LocationMarkerIcon className={'text-primary'} />
    </div>
  );
});
