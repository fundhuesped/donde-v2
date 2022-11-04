import classNames from 'classnames';
import React from 'react';

type Props = {
  children: string|JSX.Element|JSX.Element[];
  type?: string;
  className: string
}

export const Pill = React.memo<Props>((props) => {
  const { children, type, className } = props;

  return (
    <span
      className={classNames(
        'border border-light-gray rounded-full',
        'py-1 px-4',
        'text-xs',
        'w-fit',
        { 'bg-ultra-light-gray': type === 'primary' },
        { 'bg-white': type === 'secondary' },
        className
      )}
    >
      {children}
    </span>
  );
});
