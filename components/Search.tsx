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
  onKeyPress?: (e: any) => void;
}>;

export const Search = (props: Props) => {
  const { placeholder, onKeyPress, name, value, defaultValue, onChange, className, iconClassName } = props;

  return (
    <>
      <input
        className={className}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <SearchIcon className={iconClassName} />
    </>
  );
};
