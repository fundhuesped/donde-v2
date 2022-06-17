import React from 'react';
import { LocationMarkerIcon } from '@heroicons/react/outline';
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
      className={classNames('w-20 h-20 p-4 absolute -translate-x-2/4 -translate-y-3/4')}
    >
      <LocationMarkerIcon className={'text-primary fill-white'} />
    </div>
  );
});
