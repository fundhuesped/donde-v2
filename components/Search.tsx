import { SearchIcon } from '@heroicons/react/solid';
import React from 'react';

type Props = React.PropsWithChildren<{
  placeholder?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
  className?: string;
  iconClassName?: string;
}>;

export const Search = React.forwardRef<HTMLDivElement, Props>((props) => {
  const { placeholder, name, value, defaultValue, onChange, className, iconClassName} = props;

  return (
    <>
      <input
        className={className}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      />
      <SearchIcon className={iconClassName} />
    </>
  );
});
