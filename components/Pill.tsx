import classNames from 'classnames';
import React from 'react';

type Props = React.PropsWithChildren<{}> & React.HTMLProps<HTMLSpanElement>;

export const Pill = React.memo<Props>((props) => {
  const { children, type, className } = props;

  return (
    <span
      className={classNames(
        className,
        'border border-light-gray rounded-full',
        'py-1 px-4',
        'text-dark-gray text-xs',
        'w-fit',
        { 'bg-ultra-light-gray': type === 'primary' },
        { 'bg-white': type === 'secondary' },
      )}
    >
      {children}
    </span>
  );
});
