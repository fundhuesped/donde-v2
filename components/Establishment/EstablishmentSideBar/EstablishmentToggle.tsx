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
      className={
        'flex justify-center lg:hidden transition duration-200 ease-in w-full rounded-t-3xl lg:rounded-none pt-4 h-12 bg-ultra-light-gray '
      }
    >
      <div className={mapVisibility == 'block' ? 'absolute top-2' : ''}>
        <div className="absolute flex justify-center ">
          <span className="color-black z-40 bg-transparent" style={{ margin: '.5em 1em .5em 3em' }}>
            Ver lista
          </span>
          <span className="color-black z-40 bg-transparent" style={{ margin: '.5em 1em .5em 5em' }}>
            Ver Mapa
          </span>
        </div>

        <label className="inline-flex relative items-center cursor-pointer z-30">
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
