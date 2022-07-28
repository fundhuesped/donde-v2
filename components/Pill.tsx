import classNames from 'classnames';
import React from 'react';

type Props = React.PropsWithChildren<{}>;

export const Pill = React.memo<Props>((props) => {
  const { children } = props;

  return (
    <span
      className={classNames(
        'bg-ultra-light-gray',
        'border border-light-gray rounded-full',
        'py-1 px-4',
        'text-dark-gray text-xs',
        'w-fit',
      )}
    >
      {children}
    </span>
  );
});
