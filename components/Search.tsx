import { SearchIcon } from '@heroicons/react/solid';
import React from 'react';

type Props = React.PropsWithChildren<{
  placeholder?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
}>;

export const Search = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { placeholder, name, value, defaultValue, onChange } = props;

  return (
    <div ref={ref} className="relative">
      <input
        className="input-style w-[270px] lg:w-[370px] rounded-base h-10 text-sm text-gray-500"
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      />
      <SearchIcon className="absolute -translate-y-2/4 left-60 lg:rigth-full lg:ml-24 top-1/3 w-5 text-light-gray" />
    </div>
  );
});
