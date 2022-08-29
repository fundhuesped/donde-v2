import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Icon } from './Icon';

type Props = React.PropsWithChildren<
  {
    type?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    className?: string;
    icon?: ReactNode;
    iconSize?: 'small' | 'medium' | 'large';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    alignment?: 'left' | 'center' | 'right';
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Button: React.FC<Props> = React.memo((props) => {
  const { className, children, icon, disabled = false, type = 'primary', iconSize = 'medium', onClick, name, alignment } = props;
  return (
    <button
      onClick={onClick}
      name={name}
      className={classNames(
        className,
        'px-2 font-bold flex items-center justify-center rounded-2xl lg:max-h-14 py-content border-2 ',
        { 'rounded-xl': ['primary', 'secondary'].includes(type) },
        {
          'bg-primary text-white': type === 'primary' && !disabled,
          'bg-gray-400 text-white': type === 'primary' && disabled,
        },
        {
          'border border-primary text-primary': type === 'secondary' && !disabled,
          'border border-medium-gray text-medium-gray': type === 'secondary' && disabled,
        },
        {
          'text-primary': type === 'tertiary' && !disabled,
          'text-medium-gray': type === 'tertiary' && disabled,
        },
      )}
    >
      {icon && <Icon type={type} disabled={disabled} size={iconSize} icon={icon} />}
      <span className={classNames({ 'text-left': alignment === 'left' }, 'py-3')}>{children}</span>
    </button>
  );
});
