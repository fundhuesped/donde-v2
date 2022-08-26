import isNil from 'lodash/isNil';
import classNames from 'classnames';
import GoogleMapReact from 'google-map-react';
import { Marker } from './Marker';
import React, { useState } from 'react';

type DraggableMapProps = {
  apiKey: string;
  onChildMouseDown?: () => void;
  onChildMouseUp?: () => void;
  onChildMouseMove: (key: any, childProps: any, mouse: any) => Promise<void>;
  location: { lat: number; lng: number } | undefined;
  onChange: ({ bounds }: { bounds: any }) => void;
};

export const DraggableMap = (props: DraggableMapProps) => {
  const [isMapDraggable, setIsMapDraggable] = useState(false);

  const { apiKey, onChildMouseDown, onChildMouseUp, onChildMouseMove, location, onChange } = props;

  const handleChildMouseDown = () => {
    setIsMapDraggable(false);
    if (!isNil(onChildMouseDown)) {
      onChildMouseDown();
    }
  };
  const handleChildMouseUp = () => {
    setIsMapDraggable(true);
    if (!isNil(onChildMouseUp)) {
      onChildMouseUp();
    }
  };
  return (
    <div className={classNames('w-full mb-8 rounded-2xl')} style={{ height: '14rem' }}>
      {location && (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: apiKey,
            language: 'es',
            region: 'ar',
          }}
          options={{
            fullscreenControl: false,
            zoomControl: false,
          }}
          draggable={isMapDraggable}
          onChildMouseDown={handleChildMouseDown}
          onChildMouseUp={handleChildMouseUp}
          onChildMouseMove={onChildMouseMove}
          defaultCenter={{ lat: location.lat, lng: location.lng }}
          defaultZoom={17}
          resetBoundsOnResize={true}
          onChange={onChange}
        >
          <Marker lat={location.lat} lng={location.lng} />
        </GoogleMapReact>
      )}
    </div>
  );
};
