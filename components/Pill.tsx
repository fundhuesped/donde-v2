import classNames from 'classnames';
import React from 'react';

type Props = React.PropsWithChildren<
  {
    type?: 'primary' | 'secondary' | 'tertiary';
    className?: string;
    alignment?: 'left' | 'center' | 'right';
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Pill = React.memo<Props>((props) => {
  const { className, children, type = 'primary' } = props;

  return (
    <span
      className={classNames(
        className,
        'border border-light-gray rounded-full',
        'py-1 px-4',
        'text-dark-gray text-xs',
        {
          'bg-ultra-light-gray w-fit': type === 'primary',
        },
        {
          'bg-white ': type === 'secondary',
        },
      )}
    >
      {children}
    </span>
  );
});
