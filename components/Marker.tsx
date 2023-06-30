import React, { MouseEventHandler, MutableRefObject } from 'react';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import UserMarkerIcon from '../assets/images/UserMarkerIcon.svg';
import classNames from 'classnames';

export type MarkerProps = {
  lat: number;
  lng: number;
  className?: string;
  onClick?: MouseEventHandler;
  isSelected?: boolean;
};

export const Marker = React.memo<MarkerProps>(({ lat, lng, className, onClick, isSelected }) => {
  return (
    <button className={classNames(className, 'w-10 h-10 absolute -translate-x-1/2 -translate-y-full')} onClick={onClick}>
      <LocationMarkerIcon className={classNames('text-primary', isSelected ? 'fill-primary' : 'fill-white')} />
    </button>
  );
});

export const UserMarker = React.memo<MarkerProps>((props) => {
  return (
    <div className={classNames('absolute -translate-x-1/2 -translate-y-1/2')}>
      <UserMarkerIcon />
    </div>
  );
});
