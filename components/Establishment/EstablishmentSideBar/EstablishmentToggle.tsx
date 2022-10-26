import React from 'react';

type Props = React.PropsWithChildren<{
  setMapVisibility: (x: string) => void;
  mapVisibility: string;
}>;

const EstablishmentToggle = React.memo<Props>((props) => {
  const { setMapVisibility, mapVisibility } = props;

  const changeMapVisibility = (visibility: string) => {
    if (visibility == 'hidden') {
      setMapVisibility('block');
    } else {
      setMapVisibility('hidden');
    }
  };

  return (
    <div
      className={mapVisibility == 'block' ? 
        'flex justify-center lg:hidden transition duration-200 ease-in w-full rounded-t-3xl lg:rounded-none h-12 bg-ultra-light-gray' 
        : 'flex justify-center sticky top-2 z-40 lg:hidden transition duration-200 ease-in w-full rounded-t-3xl lg:rounded-none h-12 bg-transparent'}
    >
      <div className={mapVisibility == 'block' ? 'absolute top-2' : ''}>
        <label className="inline-flex relative items-center cursor-pointer z-30">
          <div className="absolute flex justify-center ">
            <span
              className={`z-40 bg-transparent text-${mapVisibility == 'hidden' ? 'white' : 'primary'}`}
              style={{ margin: '.5em 1em .5em 3em' }}
            >
              Ver lista
            </span>
            <span
              className={`z-40 bg-transparent text-${mapVisibility == 'hidden' ? 'primary' : 'white'}`}
              style={{ margin: '.5em 1em .5em 5em' }}
            >
              Ver Mapa
            </span>
          </div>
          <input
            checked={mapVisibility == 'block' ? true : false}
            type="checkbox"
            onChange={() => changeMapVisibility(mapVisibility)}
            id="toggle"
            className="sr-only peer"
          ></input>
          <div className="w-80 h-10 bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:bg-primary after:rounded-full after:h-10 after:w-40 after:transition-all peer-checked:bg-white"></div>
        </label>
      </div>
    </div>
  );
});

export default EstablishmentToggle;
