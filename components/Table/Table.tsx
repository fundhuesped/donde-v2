import { SearchIcon } from '@heroicons/react/outline';
import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
  title?: string;
  placeholder?: string;
}>;

const Table = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, title, placeholder } = props;

  return (
    <div ref={ref} className="md:w-9/12 mx-auto py-12">
      <div className="flex flex-row justify-between">
        <h1 className={'text-lg text-black font-bold mb-8'} style={{ fontSize: '24px' }}>
          {title}
        </h1>
        <div style={{ position: 'relative' }}>
          <input
            className="input-style w-[270px] lg:w-[370px] rounded-base h-10 text-sm color-[#D1D1D7]"
            placeholder={placeholder}
          />
          <SearchIcon
            style={{
              color: '#D1D1D7',
              top: '35%',
              position: 'absolute',
              width: '1em',
              transform: 'translateY(-50%)',
            }}
            className="left-[15.2rem] lg:left-[21.2rem]"
          />
        </div>
      </div>
      <div className="table w-full">
        <table className="w-full text-sm text-left text-gray-500">{children}</table>
      </div>
    </div>
  );
});
export default Table;
